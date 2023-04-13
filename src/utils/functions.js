let minimumOfGames = 20;
let provisionalDefault = true;
let teamID = "grupo-xadrez-musas";
let fetchedData;


export function FilterByNumberOfGames(players, n) {
    return players.filter((player) => (player[2] >= n));;
}

export function HideProvisionalRatings(players) {
    return players.filter((player) => (player[3] !== true));;
}

export function DefaultMinimumOfGames(){
    return minimumOfGames;
}


export function setDefaultMinimumOfGames(n){
    minimumOfGames = n;
}

export function ProvisionalDefault(){
    return provisionalDefault;
}

export function setProvisionalDefault(v){
    provisionalDefault = v;
}


export function Team(){
    return teamID;
}

export function setTeam(id){
    teamID = id;
}

export function getFetchedData(){
    return fetchedData;
}

export function setFetchedData(d){
    fetchedData = d;
}

export function swapArrayPositions(myArray,a,b){
    const temp = myArray[a];
    myArray[a] = myArray[b];
    myArray[b] = temp;
    return myArray;
}