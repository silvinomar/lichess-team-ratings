import React from 'react';
import PlayerName from './PlayerName.js';
import { perfLabel } from '../utils/stats.js';

// Número de jogadores mostrados por omissão em cada tabela
export const TOP_N = 5;
// Mínimo de jogadores com rating estabelecido para mostrar a média da variante
const MIN_PLAYERS_FOR_AVERAGE = 5;

// Tabela de uma variante: top N sem provisionais; "Show all" mostra todos (incluindo provisionais, marcados com ?)
class StandingsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expanded: false };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        const { name, players, totalGames, modeIndex = 0 } = this.props;
        const { expanded } = this.state;

        const established = players.filter(p => !p.prov);
        const rows = expanded ? players : established.slice(0, TOP_N);
        const hasMore = players.length > rows.length || expanded;
        const modeTone = Math.abs(modeIndex) % 4;

        const average = established.length >= MIN_PLAYERS_FOR_AVERAGE
            ? Math.round(established.reduce((sum, p) => sum + p.rating, 0) / established.length)
            : null;

        return (
            <div className={`standings-item mode-tone-${modeTone}`}>
                <article className="standings-card">
                    <header className="standings-card-header">
                        <h3>
                            <span className="mode-swatch" aria-hidden="true" />
                            {perfLabel(name)}
                        </h3>
                        <p className="standings-card-meta">
                            {players.length} players · {Number(totalGames).toLocaleString()} games
                            {average !== null && <> · avg {average}</>}
                        </p>
                    </header>

                    <div className="standings-table-scroll" role="region" aria-label={`${perfLabel(name)} standings`} tabIndex={0}>
                        <table className="standings-table">
                            <caption>{perfLabel(name)} ratings</caption>
                            <colgroup>
                                <col className="rank-column" />
                                <col className="player-column" />
                                <col className="rating-column" />
                                <col className="games-column" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Player</th>
                                    <th scope="col" className="number-cell">Rating</th>
                                    <th scope="col" className="number-cell">Games</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 &&
                                    <tr>
                                        <td colSpan="4" className="empty-category">
                                            No established ratings yet
                                        </td>
                                    </tr>}
                                {rows.map((p, i) => (
                                    <tr key={p.username} className={p.prov ? 'is-provisional' : undefined}>
                                        <td className="rank-cell">{i + 1}</td>
                                        <td className="player-cell">
                                            <PlayerName username={p.username} title={p.title} flair={p.flair} />
                                        </td>
                                        <td className="number-cell">
                                            {p.rating}{p.prov && <span className="provisional-mark" title="Provisional rating" aria-label="Provisional rating">?</span>}
                                        </td>
                                        <td className="number-cell">{p.games.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {hasMore &&
                        <div className="show-all-control">
                            <button type="button" onClick={this.toggle} aria-expanded={expanded}>
                                {expanded ? `Show top ${TOP_N}` : `Show all (${players.length})`}
                            </button>
                        </div>}
                </article>
            </div>
        );
    }
}

export default StandingsTable;