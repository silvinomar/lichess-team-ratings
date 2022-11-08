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
                return filteredData.map((player) => <a href={"https://lichess.org/@/" + player[0]} target="_blank" key={player[0]}><li>{player[0]} <span className='rating'>{player[1]}{player[3] ? '?' : ''}</span></li></a>);
            } else {
                return filteredData.slice(0, 10).map((player) => <a href={"https://lichess.org/@/" + player[0]} target="_blank" key={player[0]}><li>{player[0]} <span className='rating'>{player[1]}{player[3] ? '?' : ''}</span></li></a>);
            }
        }
    }

    let linkDisabledClass = "";
    let plusButton = "+";

    if (numberOfRatings <= 10 || props.single) {
        linkDisabledClass = "link-disabled";
        plusButton = ""
    }

    if (props.single) {
        articleClass = "col-12 text-dark variant-container px-0"
    } else {
        articleClass = "col-sm-6 cold-md-3 col-lg-4 text-dark variant-container px-0"
    }

    return (
        <article className={articleClass}>
            <span className={"nodecoration " + linkDisabledClass}>
                <Link to={statName} >
                    <h3 className="sticky-top lead bg-dark text-white p-2 mb-0">
                        {statName} <span>{plusButton}</span>
                    </h3>
                </Link>
            </span>
            <ol className="px-0 mb-0">
                {tableData}
            </ol>
        </article>
    )
}

export default StatsTable