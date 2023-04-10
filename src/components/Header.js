import React from 'react'
import Loading from './Loading'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional


const Header = (props) => {
    return (
        <header className='py-5'>
            <h1 className='team-name mb-5'>
                Lichess team stats
            </h1>

            <div className='generalOverview'>
                <h2>
                    Team:
                    <a href={'https://lichess.org/team/' + props.teamName} target='_blank'>{props.teamName}</a>
                </h2>

                <h2>
                    Team members:
                    <Loading />
                    <span>{props.teamMembersN.toLocaleString('en-US')}</span>
                </h2>

                <h2>
                    Super champion:
                    <Loading />
                    <span>
                        <a href={"https://lichess.org/@/" + props.superChampion} target='_blank'>
                            {props.superChampion}
                            <span className="badge bg-success text-white">
                                {props.superChampionRating}
                            </span>
                        </a>
                    </span>
                    <span className='d-block font-weight-light'>
                        Player with the highest average rating across
                        <Tippy content="puzzle, bullet, blitz, rapid, classical, correspondence, chess960, atomic, racingKings, kingOfTheHill, crazyhouse, threeCheck, horde, antichess, ultraBullet">
                            <button>
                                all variants and time controls
                            </button>
                        </Tippy>
                    </span>
                </h2>


                <h2>
                    Standard champion:
                    <Loading />
                    <span>
                        <a href={"https://lichess.org/@/" + props.standardChampion} target='_blank'>
                            {props.standardChampion}
                            <span className="badge bg-success text-white">
                                {props.standardChampionRating}
                            </span>
                        </a>
                    </span>
                    <span className='d-block font-weight-light'>
                        Player with the highest average rating across
                        <Tippy content="puzzle, bullet, blitz, rapid, classical, correspondence, ultraBullet">
                            <button>
                                all standard time controls
                            </button>
                        </Tippy>
                    </span>
                </h2>

                <h2>
                    Variants champion:
                    <Loading />
                    <span>
                        <a href={"https://lichess.org/@/" + props.variantChampion} target='_blank'>
                            {props.variantChampion}
                            <span className="badge bg-success text-white">
                                {props.variantChampionRating}
                            </span>
                        </a>
                    </span>
                    <span className='d-block font-weight-light'>
                        Player with the highest average rating across
                        <Tippy content="chess960, atomic, racingKings, kingOfTheHill, crazyhouse, threeCheck, horde, antichess">
                            <button>
                                chess variants
                            </button>
                        </Tippy>
                    </span>
                </h2>

                <h2>
                    Most played variant/time-control:
                    <Loading />
                    <span>
                        {props.mostPlayedVariantName}
                        <span className="badge bg-success text-white">{props.mostPlayedVariantN.toLocaleString('en-US')}</span>
                    </span>
                </h2>

            </div>
        </header>
    )
}

export default Header