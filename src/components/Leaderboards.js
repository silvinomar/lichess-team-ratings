import React from 'react';
import Tabela from './Tabela.js';
import Footer from './Footer.js'

import { Team } from '../utils/functions.js'
import { setFetchedData } from '../utils/functions.js'
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
            variants: [],
            ratings: {},
            variantName: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleFetch = this.handleFetch.bind(this);


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
                console.log("data: " +array);
                array = '{"players":[' + array.slice(0, -1) + ']}'
                if (!array.length) {
                    console.error('error getting team data');
                    return;
                }
                try {
                    array = JSON.parse(array);
                } catch (e) {
                    console.log(e)
                    return;
                }

                let ratings = {};
                let variants = [];
                variants.push('Super Champions')
                variants.push('Standard Champions')
                variants.push('Weird Champions')

                ratings['Super Champions'] = [];
                ratings['Standard Champions'] = [];
                ratings['Weird Champions'] = [];
                let std_modes_cntr = 0;
                for (let player in array.players) {
                    for (let i in array.players[player].perfs) {
                        if (!variants.includes(i) && i !== "streak" && i !== "storm" && i !== "racer") {
                            variants.push(i)
                            if (i === 'ultraBullet' || i === 'bullet' || i === 'blitz' ||
                                i === 'rapid' || i === 'classical' ||
                                i === 'correspondence' || i === 'puzzle') {
                                std_modes_cntr += 1
                            }
                        }
                    }
                }

                let all_modes_cntr = variants.length-3;
                let weird_modes_cntr = all_modes_cntr - std_modes_cntr;
                for (let player in array.players) {
                    let standard_avg = 0;
                    let weird_avg = 0;
                    let all_avg = 0;
                    let standard_games_cnt = 0;
                    let weird_games_cnt = 0;
                    let all_games_cnt = 0;
                    for (let i in array.players[player].perfs) {
                        if (!('games' in array.players[player]['perfs'][i]))
                            continue
                        if (i === 'ultraBullet' || i === 'bullet' || i === 'blitz' || i === 'rapid' || i === 'classical' || i === 'correspondence' || i === 'puzzle') {
                            standard_games_cnt += array.players[player]['perfs'][i]['games'];
                            standard_avg += array.players[player]['perfs'][i]['rating'];
                        }
                        else {
                            weird_games_cnt += array.players[player]['perfs'][i]['games'];
                            weird_avg += array.players[player]['perfs'][i]['rating'];
                        }
                        all_games_cnt += array.players[player]['perfs'][i]['games'];
                        all_avg += array.players[player]['perfs'][i]['rating'];
                        if (!(i in ratings)) ratings[i] = [];
                        ratings[i].push([array.players[player].username, array.players[player]['perfs'][i]['rating'], array.players[player]['perfs'][i]['games'], array.players[player]['perfs'][i]['prov']]);
                    }
                    weird_avg /= weird_modes_cntr;
                    standard_avg /= std_modes_cntr;
                    all_avg /= all_modes_cntr;
                    ratings['Super Champions'].push([array.players[player].username, Math.round(all_avg), all_games_cnt]);
                    ratings['Standard Champions'].push([array.players[player].username, Math.round(standard_avg), standard_games_cnt]);
                    ratings['Weird Champions'].push([array.players[player].username, Math.round(weird_avg), weird_games_cnt]);
                }
                //Ordenar cada variante por rating (descendente)
                for (let i in ratings) ratings[i] = ratings[i].sort((a, b) => b[1] - a[1]);


                const fetched = {
                    minGames: MinimumOfGames(),
                    lastUpdate: new Date().toString(),
                    showProvisionalRatings: ProvisionalDefault(),
                    variantName: "",
                    variants: variants,
                    ratings: ratings
                }

                this.setState(fetched);
                setFetchedData(fetched);
            })
            .catch((err) => {
                console.error(err);
            });
    };


    render() {
        return (
            <section className='leaderboard-container container' >
                <div className='row'>
                    {/*<h2 className='display-4 col-12 mb-3'>Leaderboards</h2>*/}
                    <section className='col-12 filters sticky-top bg-white py-3'>
                        <div className='lead small'>
                            <h5>Filters</h5>
                            <p className='my-1'>A player needs to have at least <input type="number" name="minGames" id="minGames" placeholder={this.state.minGames} min="0" maxLength="5" onChange={this.handleChange}></input> rated games to appear on the leaderboards</p>
                            <p className='my-1 provisionalInput'>
                                <label htmlFor="prov">Show provisional ratings</label> <input type="checkbox" id="prov" defaultChecked={this.state.showProvisionalRatings} onChange={this.handleToggle} />
                            </p>
                        </div>
                    </section>

                    {this.state.variants.map(vname => (
                        <Tabela key={vname} name={vname} data={this.state.ratings[vname]} minGames={this.state.minGames} single={false} prov={this.state.showProvisionalRatings} />
                    ))}


                </div >


                <Footer date={this.state.lastUpdate} />

            </section>)
    } //return

} //class

export default Leaderboards




