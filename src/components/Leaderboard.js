import React from 'react';
import Tabela from './Tabela.js';
import Footer from './Footer.js'

import { setMinimumOfGames } from './functions.js'
import { setProvisionalDefault } from './functions.js'
import { ProvisionalDefault } from './functions.js'

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.team = 'grupo-xadrez-musas';
        this.state = {
            minGames: props.minOfGames,
            lastUpdate: "",
            showProvisionalRatings: ProvisionalDefault(),
            variantName: props.variantName,
            data: []
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

                let ratings = [];
                if (array.length > 0) {

                    //Preencher variantes com os dados de cada jogador 
                    for (let i = 0; i < array.length; i++) {
                        if (isJsonString(array[i])) {
                            let player = JSON.parse(array[i]);

                            if (player.perfs[this.state.variantName] != null) {
                                ratings.push([player.username, player.perfs[this.state.variantName].rating, player.perfs[this.state.variantName].games, player.perfs[this.state.variantName].prov]);
                            } else {
                                ratings.push([player.username, 0, 0, true]);
                            }
                        }
                    }
                }

                //Ordenar cada variante por rating (descendente)
                ratings = ratings.sort((a, b) => b[1] - a[1]);


                this.setState({
                    lastUpdate: new Date().toString(),
                    data: ratings
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
                    <p className='col-12'><a href='/' className='py-2'>Go back &#60;</a></p>

                    <h2 className='display-4 col-12 mb-3'>Leaderboards</h2>
                    <p className='col-12 my-1'>A player needs to have at least <input type="number" name="minGames" id="minGames" placeholder={this.state.minGames} min="0" maxLength="5" onChange={this.handleChange}></input> rated games to appear on the leaderboards</p>
                    <p className='col-12 my-1'>Show provisional ratings <input type="checkbox" defaultChecked={this.state.showProvisionalRatings} onChange={this.handleToggle}/></p>

                    <Tabela key={this.state.variantName} name={this.state.variantName} data={this.state.data} minGames={this.state.minGames} single={true}  prov={this.state.showProvisionalRatings}/>



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

export default Leaderboard




