import React from 'react'

const StatsTable = (props) => {

    const statName = props.name;
    let tableData = composeTableData(props.data, 10);
     
    function composeTableData(players, max) {
        //console.log(players);
        let li = [];
        if (players && players.length > 0) {
            li = players.slice(0, max).map((player) =>
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
        }
        return li;
    }

    return (
        <article className={"col-sm-12 col-md-6 col-lg-4 text-dark variant-container px-0 "}>

            <h3 className="lead bg-dark text-white p-2 mb-0">
                <span className={"mr-2 li-icon i-" + statName}></span>
                <span>{statName}</span>
            </h3>

            <ol className="px-0 mb-0">
                {tableData}
            </ol>


        </article>
    )
}

export default StatsTable