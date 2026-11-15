import React from 'react';

function ProgressBar({ progress, loaded, total, teamName }) {
    const value = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0;

    return (
        <section className="loading-panel" aria-label="Loading team data">
            <div className="loading-copy">
                <p className="loading-title">Loading {teamName} stats</p>
                <p className="loading-count">
                    {Number(loaded).toLocaleString()} of {Number(total).toLocaleString()} player details
                </p>
            </div>
            <div
                className="loading-track"
                role="progressbar"
                aria-label="Player details fetched"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                aria-valuetext={`${value}% complete`}
            >
                <span className="loading-fill" style={{ width: `${value}%` }} />
            </div>
        </section>
    );
}

export default ProgressBar;