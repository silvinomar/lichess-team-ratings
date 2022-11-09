import React from 'react';
import Tabela from './Tabela.js';
import Footer from './Footer.js'

import { Variants } from '../utils/Variants.js';
import { Team } from '../utils/functions.js'
import { setMinimumOfGames } from '../utils/functions.js'
import { MinimumOfGames } from '../utils/functions.js'
import { setProvisionalDefault } from '../utils/functions.js'
import { ProvisionalDefault } from '../utils/functions.js'


class Leaderboards extends React.Component {
    constructor(props) {
        super(props);
        this.team = Team();
        this.state = {
            minGames: MinimumOfGames(),
            lastUpdate: "",
            showProvisionalRatings: ProvisionalDefault(),
            bulletRatings: [],
            blitzRatings: [],
            rapidRatings: [],
            classicalRatings: [],
            correspondenceRatings: [],
            puzzleRatings: [],
            chess960Ratings: [],
            hordeRatings: [],
            antichessRatings: [],
            atomicRatings: [],
            racingKingsRatings: [],
            kingOfTheHillRatings: [],
            crazyhouseRatings: [],
            threeCheckRatings: []

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);

    }
    componentDidMount() {
        this.handleFetch(this.team);
    }

    handleChange = (event) => {
        this.setState({ minGames: event.target.value });
        setMinimumOfGames(event.target.value);
        //this.handleFetch(this.team);
    };

    handleToggle = () => {
        this.setState({ showProvisionalRatings: !this.state.showProvisionalRatings });
        setProvisionalDefault(this.state.showProvisionalRatings);
    }

    handleFetch = (team) => {
        fetch(
            "https://lichess.org/api/team/" +
            team + "/users")
            .then((response) => response.text())
            .then(data => data.split('\n'))
            .then((array) => {

                let bullet = [];
                let blitz = [];
                let rapid = [];
                let classical = [];
                let correspondence = [];
                let puzzle = [];
                let chess960 = [];
                let horde = [];
                let antichess = [];
                let atomic = [];
                let racingKings = [];
                let kingOfTheHill = [];
                let crazyhouse = [];
                let threeCheck = [];
                if (array.length > 0) {

                    //Preencher variantes com os dados de cada jogador 
                    for (let i = 0; i < array.length; i++) {
                        if (isJsonString(array[i])) {
                            let player = JSON.parse(array[i]);

                            if (player.perfs.bullet != null) {
                                bullet.push([player.username, player.perfs.bullet.rating, player.perfs.bullet.games, player.perfs.bullet.prov]);
                            } else {
                                bullet.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.blitz != null) {
                                blitz.push([player.username, player.perfs.blitz.rating, player.perfs.blitz.games, player.perfs.blitz.prov]);
                            } else {
                                blitz.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.rapid != null) {
                                rapid.push([player.username, player.perfs.rapid.rating, player.perfs.rapid.games, player.perfs.rapid.prov]);
                            } else {
                                rapid.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.classical != null) {
                                classical.push([player.username, player.perfs.classical.rating, player.perfs.classical.games, player.perfs.classical.prov]);
                            } else {
                                classical.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.correspondence != null) {
                                correspondence.push([player.username, player.perfs.correspondence.rating, player.perfs.correspondence.games, player.perfs.correspondence.prov]);
                            } else {
                                correspondence.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.puzzle != null) {
                                puzzle.push([player.username, player.perfs.puzzle.rating, player.perfs.puzzle.games, player.perfs.puzzle.prov]);
                            } else {
                                puzzle.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.chess960 != null) {
                                chess960.push([player.username, player.perfs.chess960.rating, player.perfs.chess960.games, player.perfs.chess960.prov]);
                            } else {
                                chess960.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.horde != null) {
                                horde.push([player.username, player.perfs.horde.rating, player.perfs.horde.games, player.perfs.horde.prov]);
                            } else {
                                horde.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.antichess != null) {
                                antichess.push([player.username, player.perfs.antichess.rating, player.perfs.antichess.games, player.perfs.antichess.prov]);
                            } else {
                                antichess.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.atomic != null) {
                                atomic.push([player.username, player.perfs.atomic.rating, player.perfs.atomic.games, player.perfs.atomic.prov]);
                            } else {
                                atomic.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.racingKings != null) {
                                racingKings.push([player.username, player.perfs.racingKings.rating, player.perfs.racingKings.games, player.perfs.racingKings.prov]);
                            } else {
                                racingKings.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.kingOfTheHill != null) {
                                kingOfTheHill.push([player.username, player.perfs.kingOfTheHill.rating, player.perfs.kingOfTheHill.games, player.perfs.kingOfTheHill.prov]);
                            } else {
                                kingOfTheHill.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.crazyhouse != null) {
                                crazyhouse.push([player.username, player.perfs.crazyhouse.rating, player.perfs.crazyhouse.games, player.perfs.crazyhouse.prov]);
                            } else {
                                crazyhouse.push([player.username, 0, 0, true]);
                            }

                            if (player.perfs.threeCheck != null) {
                                threeCheck.push([player.username, player.perfs.threeCheck.rating, player.perfs.threeCheck.games, player.perfs.threeCheck.prov]);
                            } else {
                                threeCheck.push([player.username, 0, 0, true]);
                            }
                        }
                    }
                }

                //Ordenar cada variante por rating (descendente)
                bullet = bullet.sort((a, b) => b[1] - a[1]);
                blitz = blitz.sort((a, b) => b[1] - a[1]);
                rapid = rapid.sort((a, b) => b[1] - a[1]);
                classical = classical.sort((a, b) => b[1] - a[1]);
                correspondence = correspondence.sort((a, b) => b[1] - a[1]);
                puzzle = puzzle.sort((a, b) => b[1] - a[1]);
                chess960 = chess960.sort((a, b) => b[1] - a[1]);
                horde = horde.sort((a, b) => b[1] - a[1]);
                antichess = antichess.sort((a, b) => b[1] - a[1]);
                atomic = atomic.sort((a, b) => b[1] - a[1]);
                racingKings = racingKings.sort((a, b) => b[1] - a[1]);
                kingOfTheHill = kingOfTheHill.sort((a, b) => b[1] - a[1]);
                crazyhouse = crazyhouse.sort((a, b) => b[1] - a[1]);
                threeCheck = threeCheck.sort((a, b) => b[1] - a[1]);

                this.setState({
                    lastUpdate: new Date().toString(),
                    bulletRatings: bullet,
                    blitzRatings: blitz,
                    rapidRatings: rapid,
                    classicalRatings: classical,
                    correspondenceRatings: correspondence,
                    puzzleRatings: puzzle,
                    chess960Ratings: chess960,
                    hordeRatings: horde,
                    antichessRatings: antichess,
                    atomicRatings: atomic,
                    racingKingsRatings: racingKings,
                    kingOfTheHillRatings: kingOfTheHill,
                    crazyhouseRatings: crazyhouse,
                    threeCheckRatings: threeCheck
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };


    render() {
        return (
            <section className='leaderboard-container container' >
                <div className='row'>
                    <h2 className='display-4 col-12 mb-3'>Leaderboards</h2>
                    <p className='col-12 my-1'>A player needs to have at least <input type="number" name="minGames" id="minGames" placeholder={this.state.minGames} min="0" maxLength="5" onChange={this.handleChange}></input> rated games to appear on the leaderboards</p>
                    <p className='col-12 my-1'>Show provisional ratings <input type="checkbox" defaultChecked={this.state.showProvisionalRatings} onChange={this.handleToggle}/></p>


                    {Variants().map(vname => (
                        <Tabela key={vname} name={vname} data={this.state[vname + "Ratings"]} minGames={this.state.minGames} single={false} prov={this.state.showProvisionalRatings}/>
                    ))}


                </div >


                <Footer date={this.state.lastUpdate} />

            </section>)
    } //return

} //class

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export default Leaderboards




