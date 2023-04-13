import React from 'react';
import Header from './Header.js';
import Tabela from './Tabela.js';
import Footer from './Footer.js'
import Loading from './Loading.js'
import Filters from './Filters.js'

import { DefaultMinimumOfGames } from '../utils/defaults.js'
import { MinimumOfGamesToCalculateAverage } from '../utils/defaults.js'
import { ProvisionalDefault } from '../utils/defaults.js'
import { DefaultTeamID } from '../utils/defaults.js'



class Leaderboards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: DefaultTeamID(),
            minGames: DefaultMinimumOfGames(),
            showProvisionalRatings: ProvisionalDefault(),
            lastUpdate: "",
            variants: [],
            ratings: {},
            variantName: "",
            teamMembers: "N/D",
            avgRating: "N/D",
            superChampion: ["N/D", "N/D"],
            standardChampion: ["N/D","N/D"],
            variantChampion: ["N/D","N/D"],
            mostPlayedVariant: ["N/D","N/D"],
            highestRatedVariant: ["N/D", "N/D"],
            highestRatedPlayer: ["N/D", "N/D", "N/D"],
            averageRatings:{},
            totalGames:{},
            loadingState: "loading",
            fixedFilters: "",
            collapseFilters: "closed"
        };

        this.handleChangeMinGames = this.handleChangeMinGames.bind(this);
        this.handleChangeTeamName = this.handleChangeTeamName.bind(this);
        this.handleToggleProvisional = this.handleToggleProvisional.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
        this.toggleFiltersTab = this.toggleFiltersTab.bind(this);
    }

    componentDidMount() {
        this.handleFetch(this.state.team);
    }

    handleChangeTeamName = () => {
        let team = document.getElementById("teamName").value;
        this.setState({ team: team });
        this.handleFetch(team);
    }

    handleChangeMinGames = (event) => {
        this.setState({ minGames: event.target.value });
    };

    handleToggleProvisional = () => {
        this.setState({ showProvisionalRatings: !this.state.showProvisionalRatings });
    }

    toggleFiltersTab() {
        let collapse = (this.state.collapseFilters === "") ? "closed" : "";
        this.setState({ "collapseFilters": collapse });
    }

    handleFetch = (team) => {
        this.setState({ loadingState: "loading ", teamMembers: "N/D", avgRating: "N/D", superChampion: "N/D", superChampionRating: "N/D", standardChampion: "N/D", standardChampionRating: "N/D", variantChampion: "N/D", variantChampionRating: "N/D", mostPlayedVariant: "N/D", mostPlayedVariantNumber: "N/D" });

        //find all elements with class "loading" and add the class "loading-animation"
        let loadingElements = document.getElementsByClassName("loading");
        for (let i = 0; i < loadingElements.length; i++) {
            loadingElements[i].classList.add("loading-animation");
        }

        fetch(
            "https://lichess.org/api/team/" +
            team + "/users")
            .then((response) => response.text())
            .then(data => data.split('\n'))
            .then((playersData) => {
                playersData = '{"players":[' + playersData.slice(0, -1) + ']}'
                if (!playersData.length) {
                    console.error('error getting team data');
                    return;
                }
                try {
                    playersData = JSON.parse(playersData);
                } catch (e) {
                    console.log(e)
                    return;
                }

                this.state.teamMembers = playersData.players.length;

                let variants = [];
                variants.push('Super Champions')
                variants.push('Standard Champions')
                variants.push('Variant Champions')

                let ratings = {};
                ratings['Super Champions'] = [];
                ratings['Standard Champions'] = [];
                ratings['Variant Champions'] = [];


                let std_modes_cntr = 0;
                for (let player in playersData.players) {
                    for (let i in playersData.players[player].perfs) {
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

                //Calculate the number of games played for each variant and sort the variants by the number of games played
                let gamesPlayed = {};
                for (let i in variants) {
                    //console.log(variants[i]);
                    gamesPlayed[variants[i]] = 0;
                }
                for (let player in playersData.players) {
                    for (let i in playersData.players[player].perfs) {
                        if (i !== "streak" && i !== "storm" && i !== "racer") {
                            if (!('games' in playersData.players[player]['perfs'][i]))
                                continue
                            gamesPlayed[i] += playersData.players[player]['perfs'][i]['games'];
                        }
                    }
                }

                variants.sort(function (a, b) {
                    return gamesPlayed[b] - gamesPlayed[a];
                });


                let all_modes_cntr = variants.length - 3;
                let weird_modes_cntr = all_modes_cntr - std_modes_cntr;
                for (let player in playersData.players) {
                    let standard_avg = 0;
                    let weird_avg = 0;
                    let all_avg = 0;
                    let standard_games_cnt = 0;
                    let weird_games_cnt = 0;
                    let all_games_cnt = 0;


                    for (let i in playersData.players[player].perfs) {

                        if (!('games' in playersData.players[player]['perfs'][i]))
                            continue
                        if (i === 'ultraBullet' || i === 'bullet' || i === 'blitz' || i === 'rapid' || i === 'classical' || i === 'correspondence' || i === 'puzzle') {
                            standard_games_cnt += playersData.players[player]['perfs'][i]['games'];
                            standard_avg += playersData.players[player]['perfs'][i]['rating'];
                        }
                        else {
                            weird_games_cnt += playersData.players[player]['perfs'][i]['games'];
                            weird_avg += playersData.players[player]['perfs'][i]['rating'];
                        }
                        all_games_cnt += playersData.players[player]['perfs'][i]['games'];
                        all_avg += playersData.players[player]['perfs'][i]['rating'];
                        if (!(i in ratings)) ratings[i] = [];
                        ratings[i].push([playersData.players[player].username, playersData.players[player]['perfs'][i]['rating'], playersData.players[player]['perfs'][i]['games'], playersData.players[player]['perfs'][i]['prov']]);
                    }
                    weird_avg /= weird_modes_cntr;
                    standard_avg /= std_modes_cntr;
                    all_avg /= all_modes_cntr;
                    ratings['Super Champions'].push([playersData.players[player].username, Math.round(all_avg), all_games_cnt]);
                    ratings['Standard Champions'].push([playersData.players[player].username, Math.round(standard_avg), standard_games_cnt]);
                    ratings['Variant Champions'].push([playersData.players[player].username, Math.round(weird_avg), weird_games_cnt]);
                }

                //Ordenar cada variante por rating (descendente)
                for (let i in ratings) ratings[i] = ratings[i].sort((a, b) => b[1] - a[1]);

                //Calculate the most played variant, excluding Super Champions, Standard Champions and Variant Champions
                let mostPlayed = "";
                let mostPlayedGames = 0;
                for (let i in ratings) {
                    if (i === 'Super Champions' || i === 'Standard Champions' || i === 'Variant Champions') continue;
                    let games = 0;
                    for (let j in ratings[i]) {
                        games += ratings[i][j][2];
                    }
                    if (games > mostPlayedGames) {
                        mostPlayed = i;
                        mostPlayedGames = games;
                    }
                }

                // calculate the total number of games played in each variant, considering only the games of the players with more than 20 games played and players with the provisional rating equal to ProvisionalDefault()
                let totalGamesByVariant = {};
                for (let i in variants) {

                    if (variants[i] === 'Super Champions' || variants[i] === 'Standard Champions' || variants[i] === 'Variant Champions') continue;

                    totalGamesByVariant[variants[i]] = 0;
                    for (let player in ratings[variants[i]]) {
                        let games = ratings[variants[i]][player][2];
                        if (games > DefaultMinimumOfGames())
                            totalGamesByVariant[variants[i]] += games;
                    }
                }

                //Clamp the totalGamesByVariant to include only the variants with more than 100 games played
                let clampedGamesByVariant = {};
                for (let i in variants) {
                    if (variants[i] === 'Super Champions' || variants[i] === 'Standard Champions' || variants[i] === 'Variant Champions') continue;
                    if (totalGamesByVariant[variants[i]] > MinimumOfGamesToCalculateAverage()) {
                        clampedGamesByVariant[variants[i]] = totalGamesByVariant[variants[i]];
                    }
                }


                let averageRatingByVariant = {};
                for (let i in variants) {
                    if (i === 'Super Champions' || i === 'Standard Champions' || i === 'Variant Champions') continue;
                    averageRatingByVariant[variants[i]] = 0;
                    let players = 0;
                    let games = 0;
                    for (let j in ratings[variants[i]]) {
                        if (ratings[variants[i]][j][2] > 20) {
                            games += ratings[variants[i]][j][2];
                            averageRatingByVariant[variants[i]] += ratings[variants[i]][j][1];
                            players++;
                        }
                    }
                    //divide averageRatingByVariant by the number of players and fix the decimal places to 0
    
                    averageRatingByVariant[variants[i]] = (averageRatingByVariant[variants[i]]/players).toFixed(0);
                }

                //sort averageRating
                averageRatingByVariant = Object.entries(averageRatingByVariant).sort((a, b) => b[1] - a[1]);
                let clampedAverageRatingByVariant = averageRatingByVariant;
                
                // Remove the variants with less than 100 games played, using the clampedGamesByVariant object
                for (let i in clampedAverageRatingByVariant) {
                    if (!(clampedAverageRatingByVariant[i][0] in clampedAverageRatingByVariant)) {
                        clampedAverageRatingByVariant.splice(i, 1);
                    }
                }
                console.log(averageRatingByVariant);
                console.log(clampedAverageRatingByVariant);

                //Calculate highest rated player across all variants
                let highestRatedPlayer = "";
                let highestRatedPlayerRating = 0;
                let highestRatedPlayerVariant = "";
                for (let i in ratings) {
                    if (i === 'Super Champions' || i === 'Standard Champions' || i === 'Variant Champions') continue;
                    for (let j in ratings[i]) {
                        if (ratings[i][j][1] > highestRatedPlayerRating) {
                            highestRatedPlayer = ratings[i][j][0];
                            highestRatedPlayerRating = ratings[i][j][1];
                            highestRatedPlayerVariant = i;
                        }
                    }
                }


                const fetched = {
                    lastUpdate: new Date().toString(),
                    variantName: "",
                    variants: variants,
                    ratings: ratings,
                    superChampion: [ratings['Super Champions'][0][0],ratings['Super Champions'][0][1]],
                    standardChampion: [ratings['Standard Champions'][0][0], ratings['Standard Champions'][0][1]],
                    variantChampion: [ratings['Variant Champions'][0][0], ratings['Variant Champions'][0][1]],
                    mostPlayedVariant: [mostPlayed, mostPlayedGames],
                    highestRatedVariant: [clampedAverageRatingByVariant[0][0], clampedAverageRatingByVariant[0][1]],
                    highestRatedPlayer:[highestRatedPlayer, highestRatedPlayerRating, highestRatedPlayerVariant],
                    averageRatings: averageRatingByVariant,
                    totalGames: totalGamesByVariant,
                    loadingState: ""
                }

                //find all elements with class name "loading" and remove the class loading-animation
                let loadingElements = document.getElementsByClassName("loading");
                for (let i = 0; i < loadingElements.length; i++) {
                    loadingElements[i].classList.remove("loading-animation");
                }

                this.setState(fetched);
            })
            .catch((err) => {
                console.error(err);
            });
    };


    render() {
        return (


            <section className='leaderboard-container container' >

                <Header teamName={this.state.team} teamMembersN={this.state.teamMembers}
                    superChampion={this.state.superChampion} 
                    standardChampion={this.state.standardChampion} 
                    variantChampion={this.state.variantChampion}
                    mostPlayedVariant={this.state.mostPlayedVariant} 
                    highestRatedVariant={this.state.highestRatedVariant}
                    highestRatedPlayer={this.state.highestRatedPlayer}
                />

                <div className='row'>

                    <Loading />

                    {this.state.variants.map(vname => (
                        <Tabela key={vname} name={vname} data={this.state.ratings[vname]} averageRating={this.state.averageRatings[vname]} totalGames={this.state.totalGames[vname]} minGames={this.state.minGames} prov={this.state.showProvisionalRatings} />
                    ))}



                </div >

                <Filters
                    fixedStatus={this.state.fixedFilters}
                    collapseStatus={this.state.collapseFilters}
                    toggleFilters={this.toggleFiltersTab}
                    changeTeamName={this.handleChangeTeamName}
                    changeMinGames={this.handleChangeMinGames}
                    changeProvisional={this.handleToggleProvisional}
                />


                <Footer date={this.state.lastUpdate} />

            </section>)
    } //return

} //class

export default Leaderboards




