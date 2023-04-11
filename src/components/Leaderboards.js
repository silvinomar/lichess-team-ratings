import React from 'react';
import Header from './Header.js';
import Tabela from './Tabela.js';
import Footer from './Footer.js'
import Loading from './Loading.js'
import Filters from './Filters.js'


import { Team } from '../utils/functions.js'
import { setTeam } from '../utils/functions.js'
import { setFetchedData } from '../utils/functions.js'
import { setMinimumOfGames } from '../utils/functions.js'
import { MinimumOfGames } from '../utils/functions.js'
import { setProvisionalDefault } from '../utils/functions.js'
import { ProvisionalDefault } from '../utils/functions.js'


class Leaderboards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: Team(),
            minGames: MinimumOfGames(),
            lastUpdate: "",
            showProvisionalRatings: ProvisionalDefault(),
            variants: [],
            ratings: {},
            variantName: "",
            teamMembers: "N/D",
            avgRating: "N/D",
            superChampion: "N/D",
            superChampionRating: "N/D",
            standardChampion: "N/D",
            standardChampionRating: "N/D",
            variantChampion: "N/D",
            variantChampionRating: "N/D",
            mostPlayedVariant: "N/D",
            mostPlayedVariantNumber: "N/D",
            loadingState: "loading",
            fixedFilters: "",
            hideFilters: "",
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
        this.setState({ variants: [] });
        //this should be called when the user changes the team name in the input field
        let team = document.getElementById("teamName").value;
        this.setState({ team: team });
        setTeam(team);
        this.handleFetch(team);
    }

    handleChangeMinGames = (event) => {
        this.setState({ minGames: event.target.value });
        setMinimumOfGames(event.target.value);
    };

    handleToggleProvisional = () => {
        this.setState({ showProvisionalRatings: !this.state.showProvisionalRatings });
        setProvisionalDefault(this.state.showProvisionalRatings);
    }


    toggleFiltersTab() {
        let collapse = (this.state.collapseFilters === "") ? "closed" : "";
        this.setState({ "collapseFilters": collapse });
    }

    // display loading message while fetching data
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
            .then((array) => {
                //console.log("data: " +array);
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
                variants.push('Variant Champions')

                ratings['Super Champions'] = [];
                ratings['Standard Champions'] = [];
                ratings['Variant Champions'] = [];

                this.state.teamMembers = array.players.length;

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

                //Calculate the number of games played for each variant and sort the variants by the number of games played
                let gamesPlayed = {};
                for (let i in variants) {
                    gamesPlayed[variants[i]] = 0;
                }   
                for (let player in array.players) {
                    for (let i in array.players[player].perfs) {
                        if (i !== "streak" && i !== "storm" && i !== "racer") {
                            if (!('games' in array.players[player]['perfs'][i]))
                                continue
                            gamesPlayed[i] += array.players[player]['perfs'][i]['games'];
                        }
                    }
                }
                variants.sort(function (a, b) {
                    return gamesPlayed[b] - gamesPlayed[a];
                });

        

                let all_modes_cntr = variants.length - 3;
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
                    ratings['Variant Champions'].push([array.players[player].username, Math.round(weird_avg), weird_games_cnt]);
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

                const fetched = {
                    minGames: MinimumOfGames(),
                    lastUpdate: new Date().toString(),
                    variantName: "",
                    variants: variants,
                    ratings: ratings,
                    superChampion: ratings['Super Champions'][0][0],
                    superChampionRating: ratings['Super Champions'][0][1],
                    standardChampion: ratings['Standard Champions'][0][0],
                    standardChampionRating: ratings['Standard Champions'][0][1],
                    variantChampion: ratings['Variant Champions'][0][0],
                    variantChampionRating: ratings['Variant Champions'][0][1],
                    mostPlayedVariant: mostPlayed,
                    mostPlayedVariantNumber: mostPlayedGames,
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
                    superChampion={this.state.superChampion} superChampionRating={this.state.superChampionRating}
                    standardChampion={this.state.standardChampion} standardChampionRating={this.state.standardChampionRating}
                    variantChampion={this.state.variantChampion} variantChampionRating={this.state.variantChampionRating}
                    mostPlayedVariantName={this.state.mostPlayedVariant} mostPlayedVariantN={this.state.mostPlayedVariantNumber}
                    highestRatedVariantName={this.state.highestRatedVariantName}
                    highestRatedVariantRating={this.state.highestRatedVariantRating}
                />

                <div className='row'>

                    <Loading />

                    {this.state.variants.map(vname => (
                        <Tabela key={vname} name={vname} data={this.state.ratings[vname]} minGames={this.state.minGames} prov={this.state.showProvisionalRatings} />
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




