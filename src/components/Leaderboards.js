import React from 'react';
import TeamHeader from '../containers/TeamHeader.js';
import Highlights from '../containers/Highlights.js';
import StandingsTable, { TOP_N } from '../containers/StandingsTable.js';
import Footer from './Footer.js';
import ProgressBar from './ProgressBar.js';

import { DefaultTeamID } from '../utils/defaults.js';
import { computeStats, summarizeMembers, bestPuzzleRatingEver } from '../utils/stats.js';

// Máximo de IDs aceites por pedido pelo endpoint POST /api/users do Lichess
const BATCH_SIZE = 300;
// Pausa entre lotes (ms) para respeitar o rate limit
const BATCH_DELAY = 500;

const PHASE_MEMBERS = "Fetching team members...";
const PHASE_RATINGS = "Fetching player ratings...";
const PHASE_CALC = "Calculating standings...";

class Leaderboards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: DefaultTeamID(),
            loading: true,
            error: null,
            // Feedback de progresso
            phase: "",
            membersFound: 0,
            totalIds: 0,
            fetchedIds: 0,
            progress: 0,
            // Dados da equipa
            teamInfo: null,
            membersCount: null,
            excluded: 0,
            lastJoined: null,
            firstJoinedAt: null,
            // Resultados
            stats: null,
            puzzleBest: null,
            lastUpdate: ""
        };

        // Cada pesquisa incrementa o token; respostas de pesquisas antigas são ignoradas
        this.fetchToken = 0;
    }

    delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Dados gerais da equipa (nome, etc.). Falhar aqui não é grave.
    async fetchTeamInfo(team) {
        try {
            const res = await fetch(`https://lichess.org/api/team/${team}`);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    // Lê a lista de membros em streaming (NDJSON), atualizando o contador à medida que chegam
    async fetchTeamMembers(team, isStale) {
        const response = await fetch(`https://lichess.org/api/team/${team}/users`);
        if (response.status === 404) {
            throw Object.assign(new Error("Team not found"), { notFound: true });
        }
        if (!response.ok) {
            throw new Error(`Error fetching ${team} users: ${response.status} ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        const players = [];

        while (true) {
            if (isStale()) { reader.cancel(); return players; }
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop(); // a última linha pode estar incompleta
            for (const line of lines) {
                if (line.trim()) players.push(JSON.parse(line));
            }
            this.setState({ membersFound: players.length });
        }
        if (buffer.trim()) players.push(JSON.parse(buffer));
        this.setState({ membersFound: players.length });

        return players;
    }

    // Obtém os detalhes dos utilizadores em lotes de 300 (POST /api/users)
    async fetchUserDetails(ids, isStale) {
        const totalIds = ids.length;
        const userDetails = [];

        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            if (isStale()) return userDetails;
            const chunk = ids.slice(i, i + BATCH_SIZE);

            let users = null;
            for (let attempt = 0; attempt < 3 && users === null; attempt++) {
                const res = await fetch('https://lichess.org/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: chunk.join(',')
                });

                if (res.status === 429) {
                    // Rate limit: o Lichess pede para esperar cerca de 1 minuto
                    this.setState({ phase: "Lichess rate limit reached. Waiting 60 s..." });
                    await this.delay(60000);
                    if (isStale()) return userDetails;
                    this.setState({ phase: PHASE_RATINGS });
                    continue;
                }
                if (!res.ok) {
                    throw new Error(`Error fetching users batch: ${res.status} ${res.statusText}`);
                }
                users = await res.json();
            }
            if (users === null) throw new Error("Rate limited by Lichess, try again later.");

            userDetails.push(...users);

            this.setState({
                fetchedIds: userDetails.length,
                progress: Math.round(userDetails.length / totalIds * 100)
            });

            // Só espera quando ainda há mais lotes
            if (i + BATCH_SIZE < ids.length) await this.delay(BATCH_DELAY);
        }

        return userDetails;
    }

    // Melhor rating de puzzles de sempre do "Puzzle master" (1 pedido extra; falhar não é grave)
    async fetchPuzzleBest(puzzleMaster, isStale) {
        try {
            const res = await fetch(`https://lichess.org/api/user/${puzzleMaster.username}/rating-history`);
            if (!res.ok) return;
            const history = await res.json();
            if (isStale()) return;
            this.setState({ puzzleBest: bestPuzzleRatingEver(history, puzzleMaster.rating) });
        } catch (error) {
            console.error("Error fetching puzzle rating history:", error.message);
        }
    }

    handleFetch = async (team) => {
        const token = ++this.fetchToken;
        const isStale = () => token !== this.fetchToken;

        this.setState({
            team,
            loading: true,
            error: null,
            stats: null,
            puzzleBest: null,
            teamInfo: null,
            membersCount: null,
            excluded: 0,
            lastJoined: null,
            firstJoinedAt: null,
            progress: 0,
            totalIds: 0,
            fetchedIds: 0,
            membersFound: 0,
            phase: PHASE_MEMBERS
        });

        try {
            // Dados gerais da equipa em paralelo com a lista de membros
            this.fetchTeamInfo(team).then(info => {
                if (info && !isStale()) this.setState({ teamInfo: info });
                console.log("info:", info);
            });

            // Fase 1: lista de membros (streaming)
            const members = await this.fetchTeamMembers(team, isStale);
            if (isStale()) return;

            const { lastJoined, firstJoinedAt } = summarizeMembers(members);
            const ids = members.map(p => p.id);
            this.setState({ totalIds: ids.length, lastJoined, firstJoinedAt, phase: PHASE_RATINGS });

            // Fase 2: detalhes (perfs) em lotes
            const userDetails = await this.fetchUserDetails(ids, isStale);
            if (isStale()) return;

            // Fase 3: cálculos
            this.setState({ phase: PHASE_CALC });

            // Filtrar jogadores com violação dos termos de serviço
            const filteredPlayers = userDetails.filter(user => !user.tosViolation);
            const stats = computeStats(filteredPlayers);

            this.setState({
                stats,
                membersCount: filteredPlayers.length,
                excluded: userDetails.length - filteredPlayers.length,
                lastUpdate: new Date().toString(),
                loading: false,
                phase: ""
            });

            if (stats.puzzleMaster) this.fetchPuzzleBest(stats.puzzleMaster, isStale);

        } catch (error) {
            if (isStale()) return;
            console.error("Error fetching data:", error.message);
            this.setState({
                loading: false,
                phase: "",
                error: error.notFound
                    ? "Team not found. Please check the team ID and try again."
                    : "Could not load data from Lichess. Please try again in a moment."
            });
        }
    }

    componentDidMount() {
        this.handleFetch(this.state.team);
    }

    render() {

        const {
            loading, error, progress, totalIds, fetchedIds, team, phase, membersFound,
            teamInfo, membersCount, excluded, lastJoined, firstJoinedAt, stats, puzzleBest, lastUpdate
        } = this.state;

        // Texto de feedback mostrado durante o carregamento
        let statusText = phase;
        if (phase === PHASE_MEMBERS && membersFound > 0) {
            statusText = `${phase} ${membersFound} found`;
        } else if (phase === PHASE_RATINGS && totalIds > 0) {
            statusText = `${phase} ${fetchedIds} of ${totalIds}`;
        }

        return (
            <div className="glaze-page">
                <TeamHeader
                    teamId={team}
                    teamInfo={teamInfo}
                    membersCount={membersCount}
                    excluded={excluded}
                    lastJoined={lastJoined}
                    firstJoinedAt={firstJoinedAt}
                    loading={loading}
                    variants={stats ? stats.variants : []}
                    onSearch={this.handleFetch}
                />

                <main className="leaderboard-container">
                    {loading &&
                        <ProgressBar progress={progress} loaded={fetchedIds} total={totalIds} teamName={team} />}

                    {loading && statusText &&
                        <p className="phase-note" role="status" aria-live="polite">{statusText}</p>}

                    {error &&
                        <section className="error-panel" role="alert">
                            <h2>Unable to load team ratings</h2>
                            <p>{error}</p>
                        </section>}

                    {!loading && !error && stats && <>
                        <Highlights stats={stats} puzzleBest={puzzleBest} />

                        <section id="leaderboards" aria-label="Standings">
                            <div className="standings-heading">
                                <h2>Standings</h2>
                                <p className="py-3">
                                    Top {TOP_N} established ratings per mode. Show all to include provisional ratings, marked with ?
                                </p>
                            </div>
                            {stats.variants.length > 0
                                ? <div className="standings-grid">
                                    {stats.variants.map((vname, modeIndex) => (
                                        <StandingsTable
                                            key={`${team}-${vname}`}
                                            name={vname}
                                            players={stats.standings[vname]}
                                            totalGames={stats.totalGames[vname]}
                                            modeIndex={modeIndex}
                                        />
                                    ))}
                                </div>
                                : <p className="empty-standings">No ratings are available for this team yet.</p>}
                        </section>

                        <Footer date={lastUpdate} />
                    </>}
                </main>
            </div>
        );
    } //return

} //class

export default Leaderboards