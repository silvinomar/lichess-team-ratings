import React from 'react'
import Header from '../components/Header.js'
import Leaderboard from '../components/Leaderboard.js'
import {MinimumOfGames} from '../utils/functions.js'


const VariantPage = (props) => {
   
    return (
        <main className="App">
            <Header />
            <Leaderboard variantName={props.variantName} minOfGames={MinimumOfGames()}/>
        </main>
    )
}

export default VariantPage



