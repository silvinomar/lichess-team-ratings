import React from 'react';

// Nome de jogador com título, flair e link para o perfil no Lichess
function PlayerName({ username, title, flair }) {
    return (
        <span className="player-name">
            {title &&
                <span className="player-title-badge">{title}</span>}
            <a href={`https://lichess.org/@/${username}`} target="_blank" rel="noopener noreferrer">
                {username}
            </a>
            {flair &&
                <img
                    className="player-flair"
                    src={`https://lichess1.org/assets/flair/img/${flair}.webp`}
                    alt=""
                    width="16"
                    height="16"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />}
        </span>
    );
}

export default PlayerName;