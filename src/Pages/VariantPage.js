import React from 'react'
import Header from '../components/Header.js'
import Leaderboard from '../components/Leaderboard.js'
import { useParams } from 'react-router-dom'


const VariantPage = () => {
    const params = useParams()
    const variantName = params.name;
    const minOfGames = params.n;

    return (
        <main className="App">
            <Header />
            <Leaderboard variantName={variantName} minOfGames={minOfGames}/>
        </main>
    )
}

export default VariantPage



