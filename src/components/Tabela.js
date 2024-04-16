import React from 'react'
import FullRankingModal from './FullRankingModal.js';

const StatsTable = (props) => {
    const statName = props.name;
    const minNumerOfGames = props.minGames;


    const filteredData = filterData(props.data, minNumerOfGames);

    let tableVisibilityClass = (filteredData.length < 1) ? "hide" : "";
    let specialTableClass = (statName === "Super Champions" || statName === "Standards Champions" || statName === "Variants Champions") ? "specialHeader" : "";


    let numberOfPlayers = filteredData.length;
    let avgRating = calculateAvgRating(filteredData);
    let numberOfGames = calculateNumberOfGames(filteredData);

    const tableData = composeTableData(filteredData, 10);
    const fullTableData = composeTableData(filteredData, numberOfPlayers);

    function filterData(players, n) {

        let fdata;
        if (players != null) {
            // filters the data by including only players with a minimum of games
            fdata = players.filter((player) => (player[2] >= n));
            if (!props.prov) {
                fdata = players.filter((player) => (player[3] !== true));
            }
        }
        return fdata;
    }

    // calculate the average rating    
    function calculateAvgRating(players) {
        let sum = 0;
        players.forEach((player) => {
            sum += player[1];
        });
        return (sum / numberOfPlayers).toFixed(0);
    }

    // calculate the total number of games
    function calculateNumberOfGames(players) {
        let games = 0;
        players.forEach((player) => {
            games += player[2];
        });
        return games.toLocaleString('en-US');
    }


    function composeTableData(players, max) {
        let li = players.slice(0, max).map((player) =>
            <a href={"https://lichess.org/@/" + player[0]} target="_blank" rel="noopener noreferrer" key={"a-" + player[0]}>
                <li>
                    <span className="player-title">{player[4]} </span>
                    {player[0]}
                    {player[5] && player[5] !== 'none' ? (
                        <span className='flair'>
                            <img src={`https://lichess1.org/assets/______2/flair/img/${player[5]}.webp`} alt={`Flair for ${player[0]}`} />
                        </span>
                    ) : ''}
                    <span className='rating'>{player[1]}
                        <span className='provisional'>
                            {player[3] ? '?' : ''}
                        </span>
                    </span>
                </li>
            </a>);
        if (max < numberOfPlayers && !specialTableClass) {

            li.push(
                <li className="viewFullRanking" key={"totalp-" + numberOfPlayers}>
                    <button type="button" data-bs-toggle="modal" data-bs-target={"#" + statName + "FullRankingModal"}>
                        full ranking
                        <span className='m-0'> ({numberOfPlayers} players)</span>
                    </button>
                </li>
            )
        }
        return li;
    }


    return (
        <article id="leaderboards" className={"col-sm-6 col-md-4 col-xl-3 text-dark variant-container px-0 " + tableVisibilityClass + " " + specialTableClass}>

            <h3 className="lead bg-dark text-white p-2 mb-0">
                <span className={"mr-2 li-icon i-" + statName}></span>
                <span>{statName}</span>
            </h3>


            <div className='stats'>
                <p className='generalStat'>
                    Total games <span className='badge bg-secondary text-white'>{numberOfGames}</span>
                </p>

                <p className='generalStat'>
                    Average rating <span className='badge bg-secondary text-white'>{avgRating}</span>
                </p>
            </div>
            <ol className="px-0 mb-0">
                {tableData}
            </ol>


            <FullRankingModal key={statName} variant={statName} data={fullTableData} />




        </article>
    )
}

export default StatsTable