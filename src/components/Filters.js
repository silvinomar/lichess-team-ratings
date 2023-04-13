import React from 'react'
import filterIcon from '../img/filter.png';

import { DefaultMinimumOfGames } from '../utils/defaults.js'
import { ProvisionalDefault } from '../utils/defaults'


const Filters = (props) => {

    return (
        <section className={'filters py-3 fixed-bottom' + props.fixedStatus + " " + props.collapseStatus}>
            <div className='lead small container'>

                <div className='d-flex justify-content-between align-items-center'>
                    <div className='my-1 filter'>
                        <b>Find a new team</b>
                        <input type='text' id='teamName' name='teamName' required placeholder="team-id"></input>
                        <input type='submit' id="newTeam" value="Search" onClick={props.changeTeamName}></input>
                    </div>
                    <button id="customize" className="btn btn-outline-secondary" onClick={props.toggleFilters}>
                        Customize <img className="icon" src={filterIcon}></img>
                    </button>
                </div>

                <div>

                    <p className='my-1 filter'>
                        <b>Number of games</b>
                        <span>Minimum of </span>
                        <input type="number" name="minGames" id="minGames" placeholder={DefaultMinimumOfGames()} min="0" maxLength="5" onChange={props.changeMinGames}></input>
                        <span> rated games (per player)</span>
                    </p>
                    <p className='my-1 filter provisionalInput'>
                        <b>Provisional ratings</b>
                        <label htmlFor="prov">Show provisional ratings</label> <input type="checkbox" id="prov" defaultChecked={ProvisionalDefault()} onChange={props.changeProvisional} />
                    </p>
                </div>
            </div>
        </section>

    )
}

export default Filters