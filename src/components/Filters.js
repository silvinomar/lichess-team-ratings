import React from 'react'
import filterIcon from '../img/filter.png';

import { DefaultMinimumOfGames } from '../utils/defaults.js'
import { ProvisionalDefault } from '../utils/defaults'


const Filters = (props) => {

    return (
        <section id="filtersTab" className={'filters  py-3 fixed-bottom' + props.fixedStatus + " " + props.collapseStatus}>
            <div className='lead small container'>

                <div className='d-flex justify-content-between align-items-center'>
                    {/* 
                   <div className='my-1 filter'>
                        <b>Find a new team</b>
                        <input type='text' id='teamName' name='teamName' required placeholder="team-id"></input>
                        <input type='submit' id="newTeam" value="Search" onClick={props.changeTeamName}></input>
                    </div>
                    */ }
                    <div className="input-group mb-1">
                        <input type="text" id='teamName' className="form-control" placeholder="Find a new team" aria-label="Team ID" aria-describedby="search-team"
                        onChange={props.updateTeamName}>
                        </input>
                        <input type='submit' className="input-group-text" value="Search" onClick={props.fetchNewTeam} id="search-team">
                        </input>
                    </div>

                    <button id="customize" className="btn btn-outline-secondary" onClick={props.toggleFilters}>
                        <span>Filter</span> <img alt="An icon consisting of three horizontal lines stacked on top of each other. The icon serves as a visual cue to the user that they can interact with the button to access additional options." className="icon" src={filterIcon}></img>
                    </button>
                </div>

                <div>

                    <p className='my-1 filter'>
                        <b>Number of games</b>
                        <span>Minimum of </span>
                        <input type="number" name="minGames" id="minGames" placeholder={DefaultMinimumOfGames()} min="0" maxLength="5" onChange={props.changeMinGames}></input>
                        <span> rated games needed to appear in a leaderboard</span>
                    </p>
                    {/*  
                        <p className='my-1 filter provisionalInput'>
                        <b>Provisional ratings</b>
                        <label htmlFor="prov">Show provisional ratings</label> <input type="checkbox" id="prov" defaultChecked={ProvisionalDefault()} onChange={props.changeProvisional} />
                        </p>
                    */}
                </div>
            </div>
        </section>

    )
}

export default Filters