import React from 'react'
import { FilterByNumberOfGames } from '../utils/functions.js';
import { HideProvisionalRatings } from '../utils/functions.js';
import { Link } from 'react-router-dom';
const StatsTable = (props) => {
    const statName = props.name;
    const minNumerOfGames = props.minGames;
    let numberOfRatings;
    let articleClass;
    const tableData = filterData(props.data, minNumerOfGames);

    function filterData(data, n) {
        if (data != null) {
            // filters the data by including only players with a minimum of games
            let filteredData = FilterByNumberOfGames(data, n);
            if (!props.prov) {
                filteredData = HideProvisionalRatings(filteredData);
            }
            numberOfRatings = filteredData.length;
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
                if (statName == "Super Champions" || statName == "Standard Champions" || statName == "Weird Champions")
                    special = "specialHeader"

                articleClass = "col-sm-6 col-md-4 col-xl-3 text-dark variant-container px-0 " + visibility + " " + special
                if (filteredData.length > 10) {
                    data.push(
                        <Link to={statName} key={statName}>
                            <li className="viewFullRanking">full {statName} ranking <p className='m-0'>({filteredData.length} players)</p></li>
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

            </a>
            <ol className="px-0 mb-0">
                {tableData}
            </ol>
        </article>
    )
}

export default StatsTable