import React from 'react'
import Loading from './Loading'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import horsey from '../img/chess64.png'

const Header = (props) => {
    return (
        <header className='py-5'>
            <h1 className='team-name mb-5'>
                <img src={horsey}></img>  Lichess team stats
            </h1>


            <div className='my-3 team-header'>
                <h2>Team:</h2>
                <a href={'https://lichess.org/team/' + props.teamName} target='_blank'>{props.teamName}</a>
            </div>

            <div className="overviewStats row justify-content-around">

                <div className='col-sm-6 col-md-4 '>
                    <h2>Players</h2>
                    <Loading />
                    <span>
                        {props.teamMembersN.toLocaleString('en-US')}
                        <span className='ml-2 li-icon i-team'></span>
                    </span>
                </div>

                <div className='col-sm-6 col-md-4 '>
                    <h2>Most played variant/time-control</h2>
                    <Loading />
                    <span>
                        {props.mostPlayedVariant[0]}
                        <i class={"ml-2 li-icon i-" + props.mostPlayedVariant[0]}></i>
                        <span className="d-block mx-auto w-50 badge bg-success text-white">{props.mostPlayedVariant[1].toLocaleString('en-US')}</span>
                    </span>
                </div>

                <div className='col-sm-6 col-md-4 '>
                    <h2>Highest rated variant/time-control
                        <Tippy content={"only variants and time controls with a minimum of 100 games played were considered"}>
                            <button className="badge bg-secondary text-white">
                                i
                            </button>
                        </Tippy>
                    </h2>


                    <Loading />
                    <span>
                        {props.highestRatedVariant[0]}
                        <i class={"ml-2 li-icon i-" + props.highestRatedVariant[0]}></i>
                        <span className="d-block w-50 mx-auto badge bg-success text-white">{props.highestRatedVariant[1]}</span>
                    </span>
                </div>



                <div className='col-sm-6 col-md-4 '>
                    <h2>Super Champion

                        <Tippy content="highest average rating across all variants and time controls: puzzle, bullet, blitz, rapid, classical, correspondence, chess960, atomic, racingKings, kingOfTheHill, crazyhouse, threeCheck, horde, antichess, ultraBullet">
                            <button className="badge bg-secondary text-white">
                                i
                            </button>
                        </Tippy>

                    </h2>
                    <Loading />
                    <span>
                        <a href={"https://lichess.org/@/" + props.superChampion[0]} target='_blank'>
                            {props.superChampion[0]}
                            <span className="badge bg-success text-white mx-2">
                                {props.superChampion[1]}
                            </span>
                        </a>
                    </span>
                </div>

                <div className='col-sm-6 col-md-4 '>
                    <h2>Standard Champion
                        <Tippy content="highest average rating across all standard time controls: puzzle, bullet, blitz, rapid, classical, correspondence, ultraBullet">
                            <button className="badge bg-secondary text-white">
                                i
                            </button>
                        </Tippy>
                    </h2>
                    <Loading />
                    <span>
                        <a href={"https://lichess.org/@/" + props.standardChampion[0]} target='_blank'>
                            {props.standardChampion[0]}
                            <span className="badge bg-success text-white mx-2">
                                {props.standardChampion[1]}
                            </span>
                        </a>
                    </span>
                </div>

                <div className='col-sm-6 col-md-4 '>
                    <h2>Variant Champions
                        <Tippy content='highest average rating across chess variants: chess960, atomic, racingKings, kingOfTheHill, crazyhouse, threeCheck, horde, antichess'>
                            <button className="badge bg-secondary text-white">
                                i
                            </button>
                        </Tippy>
                    </h2>
                    <Loading />
                    <span>
                        <a href={"https://lichess.org/@/" + props.variantChampion[0]} target='_blank'>
                            {props.variantChampion[0]}
                            <span className="badge bg-success text-white mx-2">
                                {props.variantChampion[1]}
                            </span>
                        </a>
                    </span>
                </div>

                <div className='col-sm-6 col-md-4 '>
                    <h2>Highest rated player
                    </h2>
                    <Loading />
                    <span>
                        <a href={"https://lichess.org/@/" + props.highestRatedPlayer[0]} target='_blank'>
                            {props.highestRatedPlayer[0]}
                        </a>
                        <span className="ml-2 li-icon i-crown"></span>
                        <span className="d-block w-50 mx-auto badge bg-success text-white">
                            {props.highestRatedPlayer[1]}
                        </span>

                    </span>
                </div>


            </div>


        
        </header>
    )
}

export default Header