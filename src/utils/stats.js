// Cálculos sobre os dados do Lichess (funções puras, sem React).
// Colocar em: utils/stats.js

// Time controls "normais" (excluem puzzles e variantes)
export const STANDARD_MODES = ['ultraBullet', 'bullet', 'blitz', 'rapid', 'classical', 'correspondence'];

// Entradas de `perfs` que não são modos de jogo com classificação
const IGNORED_PERFS = ['streak', 'storm', 'racer', 'standard'];

const LABELS = {
    ultraBullet: 'UltraBullet',
    bullet: 'Bullet',
    blitz: 'Blitz',
    rapid: 'Rapid',
    classical: 'Classical',
    correspondence: 'Correspondence',
    puzzle: 'Puzzles',
    chess960: 'Chess960',
    crazyhouse: 'Crazyhouse',
    antichess: 'Antichess',
    atomic: 'Atomic',
    horde: 'Horde',
    kingOfTheHill: 'King of the Hill',
    racingKings: 'Racing Kings',
    threeCheck: 'Three-check'
};

export function perfLabel(key) {
    if (LABELS[key]) return LABELS[key];
    return key.charAt(0).toUpperCase() + key.slice(1);
}

// true se `a` for melhor que `b` (maior rating; em empate, mais jogos)
function isBetter(a, b) {
    if (!b) return true;
    if (a.rating !== b.rating) return a.rating > b.rating;
    return a.games > b.games;
}

/**
 * Recebe a lista de utilizadores (resposta de POST /api/users, já sem tosViolation)
 * e devolve tudo o que a página precisa.
 *
 * Os destaques (puzzleMaster, highestRated, variantsMaster) ignoram ratings provisórios.
 * As tabelas (`standings`) incluem todos os jogadores com pelo menos 1 jogo,
 * com a flag `prov`; a UI decide se mostra os provisórios.
 */
export function computeStats(users) {
    const standings = {};   // perf -> [{ username, title, flair, rating, games, prov }]
    const totalGames = {};  // perf -> total de jogos
    const timeControls = {}; // modo standard -> { games, players }

    let puzzleMaster = null;
    let highestRated = null;
    let variantsMaster = null;

    for (const user of users) {
        const perfs = user.perfs || {};

        for (const key of Object.keys(perfs)) {
            const perf = perfs[key];
            if (IGNORED_PERFS.includes(key) || !perf || !perf.games) continue;

            const entry = {
                username: user.username,
                title: user.title,
                flair: user.flair,
                rating: perf.rating,
                games: perf.games,
                prov: !!perf.prov
            };

            if (!standings[key]) standings[key] = [];
            standings[key].push(entry);
            totalGames[key] = (totalGames[key] || 0) + perf.games;

            const isStandard = STANDARD_MODES.includes(key);

            if (isStandard) {
                if (!timeControls[key]) timeControls[key] = { games: 0, players: 0 };
                timeControls[key].games += perf.games;
                timeControls[key].players += 1;
            }

            if (entry.prov) continue;

            if (key === 'puzzle') {
                if (isBetter(entry, puzzleMaster)) puzzleMaster = entry;
            } else if (isStandard) {
                if (isBetter(entry, highestRated)) highestRated = { ...entry, mode: key };
            } else {
                if (isBetter(entry, variantsMaster)) variantsMaster = { ...entry, mode: key };
            }
        }
    }

    for (const key of Object.keys(standings)) {
        standings[key].sort((a, b) => (b.rating - a.rating) || (b.games - a.games));
    }

    // Variantes ordenadas pelo total de jogos
    const variants = Object.keys(standings).sort((a, b) => totalGames[b] - totalGames[a]);

    // Time control mais jogado (por número total de jogos)
    let mostPlayedTimeControl = null;
    for (const mode of Object.keys(timeControls)) {
        const tc = timeControls[mode];
        if (!mostPlayedTimeControl || tc.games > mostPlayedTimeControl.games) {
            mostPlayedTimeControl = {
                mode,
                games: tc.games,
                players: tc.players,
                avgPerPlayer: Math.round(tc.games / tc.players)
            };
        }
    }

    return { standings, variants, totalGames, puzzleMaster, highestRated, variantsMaster, mostPlayedTimeControl };
}

/**
 * Resume a lista de membros (resposta de /api/team/{id}/users).
 * Se a API da equipa não trouxer data de criação, a UI usa a entrada do membro mais antigo como aproximação.
 */
export function summarizeMembers(members) {
    let lastJoined = null;
    let firstJoinedAt = null;

    for (const m of members) {
        if (typeof m.joinedTeamAt !== 'number') continue;
        if (!lastJoined || m.joinedTeamAt > lastJoined.joinedTeamAt) lastJoined = m;
        if (firstJoinedAt === null || m.joinedTeamAt < firstJoinedAt) firstJoinedAt = m.joinedTeamAt;
    }

    return {
        lastJoined: lastJoined
            ? { id: lastJoined.id, name: lastJoined.name, joinedTeamAt: lastJoined.joinedTeamAt }
            : null,
        firstJoinedAt
    };
}

/**
 * Procura o melhor rating de sempre de puzzles no histórico (/api/user/{u}/rating-history).
 * Cada ponto é [ano, mês (0-11), dia, rating]. Devolve { rating, date } ou null.
 */
export function bestPuzzleRatingEver(history, currentRating) {
    let best = null;

    if (Array.isArray(history)) {
        const puzzles = history.find(h => h && h.name === 'Puzzles');
        if (puzzles && Array.isArray(puzzles.points)) {
            for (const [year, month, day, rating] of puzzles.points) {
                if (!best || rating > best.rating) {
                    best = { rating, date: new Date(year, month, day).getTime() };
                }
            }
        }
    }

    // O rating atual pode ser mais recente do que o último ponto do histórico
    if (typeof currentRating === 'number' && (!best || currentRating >= best.rating)) {
        return { rating: currentRating, date: best && best.rating === currentRating ? best.date : null, isCurrent: true };
    }
    return best;
}