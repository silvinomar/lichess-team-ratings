import React from 'react';
import PlayerName from './PlayerName.js';
import { perfLabel } from '../utils/stats.js';

const formatNumber = (n) => Number(n).toLocaleString();
const formatDate = (ms) => new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

function Card({ title, tone, children }) {
    return (
        <article className={`highlight-card highlight-tone-${tone}`}>
            <h3 className="highlight-label">{title}</h3>
            {children}
        </article>
    );
}

function PlayerCard({ title, player, detail, tone }) {
    if (!player) {
        return (
            <Card title={title} tone={tone}>
                <div className="highlight-value">N/D</div>
                <p className="highlight-detail">No player with an established rating</p>
            </Card>
        );
    }
    return (
        <Card title={title} tone={tone}>
            <div className="highlight-value">
                <PlayerName username={player.username} title={player.title} flair={player.flair} />
            </div>
            <p className="highlight-rating">{player.rating}</p>
            <p className="highlight-detail">{detail}</p>
        </Card>
    );
}

// Zona de destaques: time control mais jogado + 3 mestres (sem ratings provisórios)
function Highlights({ stats, puzzleBest }) {
    const { mostPlayedTimeControl: tc, puzzleMaster, highestRated, variantsMaster } = stats;


    return (
        <section className="highlights-grid" aria-label="Highlights">
            <Card title="Most played time control" tone={0}>
                {tc
                    ? <>
                        <div className="highlight-value">{perfLabel(tc.mode)}</div>
                        <p className="highlight-rating">{formatNumber(tc.games)}</p>
                        <p className="highlight-detail">
                            games · {formatNumber(tc.avgPerPlayer)} per player ({formatNumber(tc.players)} players)
                        </p>
                    </>
                    : <div className="highlight-value">N/D</div>}
            </Card>

            <PlayerCard
                title="Puzzle master"
                player={puzzleMaster}
                tone={1}
            />

            <PlayerCard
                title="Highest rated"
                player={highestRated}
                detail={highestRated ? `${perfLabel(highestRated.mode)} · ${formatNumber(highestRated.games)} games` : ''}
                tone={2}
            />

            <PlayerCard
                title="Variants master"
                player={variantsMaster}
                detail={variantsMaster ? `${perfLabel(variantsMaster.mode)} · ${formatNumber(variantsMaster.games)} games` : ''}
                tone={3}
            />
        </section>
    );
}

export default Highlights;
