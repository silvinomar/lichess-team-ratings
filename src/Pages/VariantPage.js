import React from 'react'
import Header from '../components/Header.js'
import SingleLeaderboard from '../components/SingleLeaderboard.js'
import {MinimumOfGames} from '../utils/functions.js'


const VariantPage = (props) => {
   
    return (
        <main className="App">
            <Header />
            <SingleLeaderboard variantName={props.variantName} minOfGames={MinimumOfGames()}/>
        </main>
    )
}

export default VariantPage



