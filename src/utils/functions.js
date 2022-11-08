let minimumOfGames = 10;
let provisionalDefault = true;

export function FilterByNumberOfGames(players, n) {
    return players.filter((player) => (player[2] >= n));;
}

export function HideProvisionalRatings(players) {
    return players.filter((player) => (player[3] !== true));;
}

export function MinimumOfGames(){
    return minimumOfGames;
}


export function setMinimumOfGames(n){
    minimumOfGames = n;
}

export function ProvisionalDefault(){
    return provisionalDefault;
}

export function setProvisionalDefault(v){
    provisionalDefault = v;
}