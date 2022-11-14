import React from 'react';
import Tabela from './Tabela.js';
import Footer from './Footer.js'

import { setMinimumOfGames } from '../utils/functions.js'
import { setProvisionalDefault } from '../utils/functions.js'
import { ProvisionalDefault } from '../utils/functions.js'
import { Team } from '../utils/functions.js'
import { Link } from 'react-router-dom'

import { getFetchedData } from '../utils/functions.js'

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.team = Team();
        this.state = getFetchedData();
        this.state.variantName = props.variantName;
        this.state.minGames = props.minOfGames;
        this.state.showProvisionalRatings = ProvisionalDefault();


        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);

    }
    componentDidMount() {
        //this.handleFetch(this.team);
    }

    handleChange = (event) => {
        this.setState({ minGames: event.target.value });
        setMinimumOfGames(event.target.value);
    };

    handleToggle = () => {
        this.setState({ showProvisionalRatings: !this.state.showProvisionalRatings });
        setProvisionalDefault(this.state.showProvisionalRatings);
    }

    render() {
        return (
            <section className='leaderboard-container container' >
                <div className='row'>
                    <p className='col-12 py-2'>
                        <Link to="/">
                            Go back &#60;
                        </Link>
                    </p>
                    {/*<h2 className='display-4 col-12 mb-3'>{this.state.variantName} Leaderboard</h2>*/}
                    <section className='col-12 filters sticky-top bg-white py-3'>
                        <div className='lead small'>
                            <h5>Filters</h5>
                            <p className='my-1'>A player needs to have at least <input type="number" name="minGames" id="minGames" placeholder={this.state.minGames} min="0" maxLength="5" onChange={this.handleChange}></input> rated games to appear on the leaderboards</p>
                            <p className='my-1'><label for="prov">Show provisional ratings</label>  <input type="checkbox" id="prov" defaultChecked={this.state.showProvisionalRatings} onChange={this.handleToggle} /></p>
                        </div>
                    </section>
                    <Tabela key={this.state.variantName} name={this.state.variantName} data={this.state[this.state.variantName + "Ratings"]} minGames={this.state.minGames} single={true} prov={this.state.showProvisionalRatings} />



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
