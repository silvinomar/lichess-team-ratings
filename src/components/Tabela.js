import React from 'react'
import { FilterByNumberOfGames } from '../utils/functions.js';
import { HideProvisionalRatings } from '../utils/functions.js';
import { Link } from 'react-router-dom';
const StatsTable = (props) => {
    const statName = props.name;
    const minNumerOfGames = props.minGames;
    let numberOfRatings;
    let averageRating = "N/D";
    let numberOfGames = "N/D";
    let articleClass;
    let titleDescription = "";
    const tableData = filterData(props.data, minNumerOfGames);

    function filterData(data, n) {

        if (data != null) {
            // filters the data by including only players with a minimum of games
            let filteredData = FilterByNumberOfGames(data, n);
            if (!props.prov) {
                filteredData = HideProvisionalRatings(filteredData);
            }
            numberOfRatings = filteredData.length;

            // calculates the average rating    
            let sum = 0;
            filteredData.forEach((player) => {
                sum += player[1];
            });
            averageRating = (sum / numberOfRatings).toFixed(0);

            // calculate the total number of games
            let games = 0;
            filteredData.forEach((player) => {
                games += player[2];
            });
            numberOfGames = games;

            // filters the data by showing only the first 10 players of the list
            if (props.single) {
                articleClass = "col-12 text-dark variant-container px-0 mt-3"
                return filteredData.map((player) => <a href={"https://lichess.org/@/" + player[0]} target="_blank" key={player[0]}><li>{player[0]} <span className='rating'>{player[1]}<span className='provisional'>{player[3] ? '?' : ''}</span></span></li></a>);
            } else {
                let data = filteredData.slice(0, 10).map((player) => <a href={"https://lichess.org/@/" + player[0]} target="_blank" key={player[0]}><li>{player[0]} <span className='rating'>{player[1]}<span className='provisional'>{player[3] ? '?' : ''}</span></span></li></a>);
                let visibility = "";
                let special = "";

                if (filteredData.length < 1)
                    visibility = "hide";
                    
                if (statName == "Super Champions" || statName == "Standard Champions" || statName == "Variant Champions")
                    special = "specialHeader"
                /*
                if (statName == "Super Champions")
                    titleDescription = "Average rating across all variants (puzzle, bullet, blitz, rapid, classical, correspondence, chess960, atomic, racingKings, kingOfTheHill, crazyhouse, threeCheck, horde, antichess, ultraBullet)"
                if (statName == "Standard Champions")
                    titleDescription = "Average rating across standard variants (puzzle, bullet, blitz, rapid, classical, correspondence, ultraBullet)"
                if (statName == "Weird Champions")
                    titleDescription = "Average rating across non-standard variants (chess960, atomic, racingKings, kingOfTheHill, crazyhouse, threeCheck, horde, antichess)"
                */

                articleClass = "col-sm-6 col-md-4 col-xl-3 text-dark variant-container px-0 " + visibility + " " + special
                if (filteredData.length > 10) {
                    data.push(
                        <Link to={statName} key={statName}>
                            <li className="viewFullRanking">full ranking <span className='m-0'>({filteredData.length} players)</span></li>
                        </Link>
                    )
                }

                return data;
            }
        }
    }

    return (
        <article className={articleClass}>
            <a>
                <h3 className="lead bg-dark text-white p-2 mb-0">
                    {statName}
                </h3>
                <p className='statDescription'>
                    {titleDescription}
                </p>
            </a>

            <div className='stats'>
                <p className='generalStat'>
                    Total games <span className='badge bg-secondary text-white'>{numberOfGames.toLocaleString('en-US')}</span>
                </p>

                <p className='generalStat'>
                    Average rating <span className='badge bg-secondary text-white'>{averageRating}</span>
                </p>
            </div>
            <ol className="px-0 mb-0">
                {tableData}
            </ol>
        </article>
    )
}

export default StatsTable