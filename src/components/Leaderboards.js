import React from 'react';
import Header from './Header.js';
import Tabela from './Tabela.js';
import TabelaEspecial from './TabelaEspecial.js';
import Footer from './Footer.js'
import Filters from './Filters.js'
import ProgressBar from './ProgressBar.js';

import { DefaultMinimumOfGames } from '../utils/defaults.js'
import { MinimumOfPlayersToCalculateAverage } from '../utils/defaults.js'
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
            specialVariants: [],
            ratings: {},
            variantName: "",
            teamMembers: "N/D",
            excluded: 0,
            avgRating: "N/D",
            superChampion: ["N/D", "N/D"],
            standardChampion: ["N/D", "N/D"],
            variantChampion: ["N/D", "N/D"],
            championsPerVariant: {},
            mostPlayedVariant: ["N/D", "N/D"],
            highestRatedVariant: ["N/D", "N/D"],
            highestRatedPlayer: ["N/D", "N/D", "N/D"],
            averageRatings: {},
            totalGames: {},
            loading: true,
            fixedFilters: "",
            collapseFilters: "closed"
        };

        this.handleChangeMinGames = this.handleChangeMinGames.bind(this);
        this.handleUpdateTeamName = this.handleUpdateTeamName.bind(this);
        this.handleToggleProvisional = this.handleToggleProvisional.bind(this);
        this.handleFetch = this.handleFetch.bind(this);
        this.handleFetchNewTeam = this.handleFetchNewTeam.bind(this);
        this.toggleFiltersTab = this.toggleFiltersTab.bind(this);
    }

    delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async handleFetch(team) {

        this.setState({ validTeam: false, progress: 0, totalIds: 0, fetchedIds: 0, teamMembers: "N/D", avgRating: "N/D", superChampion: "N/D", superChampionRating: "N/D", standardChampion: "N/D", standardChampionRating: "N/D", variantChampion: "N/D", variantChampionRating: "N/D", mostPlayedVariant: "N/D", mostPlayedVariantNumber: "N/D" });

        try {
            const response = await fetch(`https://lichess.org/api/team/${team}/users`);
            //console.log("Response received", response);
            if (!response.ok) {
                throw new Error(`Error fetching ${team} users: ${response.statusText}`);
            } else{
                this.setState({ validTeam: true });
            }
            const data = await response.text();
            //console.log("Data received", data);
            const playersData = data.split('\n');
            //console.log("Players data split", playersData);
            const playersJSON = JSON.parse('{"players":[' + playersData.slice(0, -1) + ']}');
            //console.log("Players parsed from", team, ": ", playersJSON);

            // Set total number of IDs (players) to fetch
            const totalIds = playersJSON.players.length;
            this.setState({ totalIds });

            const userDetails = [];
            for (const player of playersJSON.players) {
                try {
                    //console.log("Fetching user details for", player.id);
                    const userResponse = await fetch(`https://lichess.org/api/user/${player.id}`);
                    if (!userResponse.ok) {
                        throw new Error(`Error fetching user ${player.id}: ${userResponse.statusText}`);
                    }
                    const user = await userResponse.json();
                    userDetails.push(user);

                    // Update fetched IDs count and progress
                    this.setState(prevState => ({
                        fetchedIds: prevState.fetchedIds + 1,
                        progress: Math.round((prevState.fetchedIds + 1) / totalIds * 100)
                    }));

                    // Add a delay in ms between requests to avoid rate limiting
                    await this.delay(50);
                } catch (userFetchError) {
                    console.error("Error fetching user details:", userFetchError.message);
                }
            }

            //console.log("User details fetched", userDetails);

            // Filter out players with tosViolation
            const filteredPlayers = userDetails.filter(user => !user.tosViolation);
            const excludedCount = userDetails.length - filteredPlayers.length;

            let variants = [];
            variants.push('Super Champions')
            variants.push('Standards Champions')
            variants.push('Variants Champions')

            let ratings = {};
            ratings['Super Champions'] = [];
            ratings['Standards Champions'] = [];
            ratings['Variants Champions'] = [];

            let std_modes_cntr = 0;
            for (let player in filteredPlayers) {
                for (let i in filteredPlayers[player].perfs) {
                    if (!variants.includes(i) && i !== "streak" && i !== "storm" && i !== "racer" && i !== "standard") {
                        variants.push(i);
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

            for (let player in filteredPlayers) {
                for (let i in filteredPlayers[player].perfs) {
                    if (i !== "streak" && i !== "storm" && i !== "racer" && i !== "standard") {
                        if (!('games' in filteredPlayers[player]['perfs'][i]))
                            continue
                        gamesPlayed[i] += filteredPlayers[player]['perfs'][i]['games'];
                    }
                }
            }

            variants.sort(function (a, b) {
                return gamesPlayed[b] - gamesPlayed[a];
            });


            let all_modes_cntr = variants.length - 3;
            let weird_modes_cntr = all_modes_cntr - std_modes_cntr;
            for (let player in filteredPlayers) {
                let standard_avg = 0;
                let weird_avg = 0;
                let all_avg = 0;
                let standard_games_cnt = 0;
                let weird_games_cnt = 0;
                let all_games_cnt = 0;


                for (let i in filteredPlayers[player].perfs) {

                    if (!('games' in filteredPlayers[player]['perfs'][i]))
                        continue
                    if (i === 'ultraBullet' || i === 'bullet' || i === 'blitz' || i === 'rapid' || i === 'classical' || i === 'correspondence' || i === 'puzzle') {
                        standard_games_cnt += filteredPlayers[player]['perfs'][i]['games'];
                        standard_avg += filteredPlayers[player]['perfs'][i]['rating'];
                    }
                    else {
                        weird_games_cnt += filteredPlayers[player]['perfs'][i]['games'];
                        weird_avg += filteredPlayers[player]['perfs'][i]['rating'];
                    }
                    all_games_cnt += filteredPlayers[player]['perfs'][i]['games'];
                    all_avg += filteredPlayers[player]['perfs'][i]['rating'];

                    if (!(i in ratings)) ratings[i] = [];
                    ratings[i].push([filteredPlayers[player].username, filteredPlayers[player]['perfs'][i]['rating'], filteredPlayers[player]['perfs'][i]['games'], filteredPlayers[player]['perfs'][i]['prov'], filteredPlayers[player]['title'], filteredPlayers[player]['flair']]);
                }
                weird_avg /= weird_modes_cntr;
                standard_avg /= std_modes_cntr;
                all_avg /= all_modes_cntr;
                ratings['Super Champions'].push([filteredPlayers[player].username, Math.round(all_avg), filteredPlayers[player]['perfs']['games'], filteredPlayers[player]['perfs']['prov'], filteredPlayers[player]['title'], filteredPlayers[player]['flair']]);
                ratings['Standards Champions'].push([filteredPlayers[player].username, Math.round(standard_avg), filteredPlayers[player]['perfs']['games'], filteredPlayers[player]['perfs']['prov'], filteredPlayers[player]['title'], filteredPlayers[player]['flair']]);
                ratings['Variants Champions'].push([filteredPlayers[player].username, Math.round(weird_avg), filteredPlayers[player]['perfs']['games'], filteredPlayers[player]['perfs']['prov'], filteredPlayers[player]['title'], filteredPlayers[player]['flair']]);
            }

            //Ordenar cada variante por rating (descendente)
            for (let i in ratings) {
                ratings[i] = ratings[i].sort((a, b) => b[1] - a[1]);
                //For the this.state.championsPerVariant object, create a property for each variant and the first player in the ratings[i] as the value, as long as the player has more than 20 games played and players with the provisional rating equal to ProvisionalDefault(), otherwise, set the value to the first player to meet the requirements
                for (let j in ratings[i]) {
                    if (ratings[i][j][2] > 20) {
                        this.state.championsPerVariant[i] = [ratings[i][j][0], ratings[i][j][1]];

                        // console.log(i + " champion: " + this.state.championsPerVariant[i])
                        break;
                    }
                }

            }

            //Calculate the most played variant, excluding Super Champions, Standard Champions and Variant Champions
            let mostPlayed = "";
            let mostPlayedGames = 0;
            for (let i in ratings) {
                if (i === 'Super Champions' || i === 'Standards Champions' || i === 'Variants Champions' || i === 'standard') continue;
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

                if (variants[i] === 'Super Champions' || variants[i] === 'Standards Champions' || variants[i] === 'Variants Champions') continue;

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
                if (variants[i] === 'Super Champions' || variants[i] === 'Standards Champions' || variants[i] === 'Variants Champions') continue;
                if (totalGamesByVariant[variants[i]] > MinimumOfPlayersToCalculateAverage()) {
                    clampedGamesByVariant[variants[i]] = totalGamesByVariant[variants[i]];
                }
            }

            let tempAvgRating = {};
            for (let i in variants) {
                tempAvgRating[variants[i]] = 0;
                let players = 0;
                for (let j in ratings[variants[i]]) {
                    // Check if the player meets the criteria (e.g., minimum games played)
                    if (ratings[variants[i]][j][2] > DefaultMinimumOfGames()) {
                        tempAvgRating[variants[i]] += ratings[variants[i]][j][1];
                        players++;
                    }
                }
                // Check if the variant has at least minimumPlayersToCalculateAverage players
                if (players >= MinimumOfPlayersToCalculateAverage()) {
                    // Divide averageRatingByVariant by the number of players and fix the decimal places to 0
                    tempAvgRating[variants[i]] = (tempAvgRating[variants[i]] / players).toFixed(0);
                } else {
                    // If the variant doesn't have enough players, set the average to "N/D" (or another suitable value)
                    tempAvgRating[variants[i]] = "N/D";
                }
            }

            // Sort the averageRatingByVariant object by rating (descendant)
            const averageRatingByVariant = Object.fromEntries(
                Object.entries(tempAvgRating).sort(([, a], [, b]) => b - a)
            );

            // Clone the averageRatingByVariant object to remove variants with less than minimumPlayersToCalculateAverage games
            let clampedAverageRatingByVariant = {};
            for (let i in variants) {
                if (variants[i] === 'Super Champions' || variants[i] === 'Standards Champions' || variants[i] === 'Variants Champions') continue;
                if (totalGamesByVariant[variants[i]] > MinimumOfPlayersToCalculateAverage()) {
                    clampedAverageRatingByVariant[variants[i]] = averageRatingByVariant[variants[i]];
                }
            }

            // Sort the averageRatingByVariant object by rating (descendant)
            const averageRatingByMostPlayedVariants = Object.fromEntries(
                Object.entries(clampedAverageRatingByVariant).sort(([, a], [, b]) => b - a)
            );

            const [[highestRatedVariant, highestRatedVariantRating]] = Object.entries(averageRatingByMostPlayedVariants);


            //Calculate highest rated player across all variants
            let highestRatedPlayer = "";
            let highestRatedPlayerRating = 0;
            let highestRatedPlayerVariant = "";
            for (let i in ratings) {
                if (i === 'Super Champions' || i === 'Standards Champions' || i === 'Variants Champions') continue;
                for (let j in ratings[i]) {
                    const [player, rating, games, prov] = ratings[i][j];

                    // Check if the player meets your criteria (e.g., minimum games played and not provisional)
                    if (games > DefaultMinimumOfGames() && prov !== ProvisionalDefault()) {
                        if (rating > highestRatedPlayerRating) {
                            highestRatedPlayer = player;
                            highestRatedPlayerRating = rating;
                            highestRatedPlayerVariant = i;
                        }
                    }
                }
            }

            const fetched = {
                lastUpdate: new Date().toString(),
                excluded: excludedCount,
                teamMembers: filteredPlayers.length,
                variantName: "",
                variants: variants,
                ratings: ratings,
                specialVariants: ['Super Champions', 'Standards Champions', 'Variants Champions'],
                superChampion: [ratings['Super Champions'][0][0], ratings['Super Champions'][0][1]],
                standardChampion: [ratings['Standards Champions'][0][0], ratings['Standards Champions'][0][1]],
                variantChampion: [ratings['Variants Champions'][0][0], ratings['Variants Champions'][0][1]],
                mostPlayedVariant: [mostPlayed, mostPlayedGames],
                highestRatedVariant: [highestRatedVariant, highestRatedVariantRating],
                highestRatedPlayer: [highestRatedPlayer, highestRatedPlayerRating, highestRatedPlayerVariant],
                averageRatings: averageRatingByVariant,
                totalGames: totalGamesByVariant,
                loading: false
            }

            this.setState(fetched);


        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    componentDidMount() {
        this.handleFetch(this.state.team);
    }

    handleUpdateTeamName(event) {
        this.setState({ team: event.target.value });
    }

    handleFetchNewTeam = async () => {
        const team = this.state.team; // Get the team name from state

        this.setState({ loading: true }); // Set loading state before fetching new data
        await this.handleFetch(team); // Wait for handleFetch to complete

        // After fetching is done and state is updated, set loading to false
        this.setState({ loading: false });

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


    render() {

        const { loading, progress, totalIds, fetchedIds, team, validTeam } = this.state;

        return (

            <section className='leaderboard-container container' >

                {loading && <ProgressBar progress={progress} loaded={fetchedIds} total={totalIds} teamName={team}/>}


                {validTeam && <Header teamName={this.state.team} teamMembersN={this.state.teamMembers}
                    superChampion={this.state.superChampion}
                    standardChampion={this.state.standardChampion}
                    variantChampion={this.state.variantChampion}
                    mostPlayedVariant={this.state.mostPlayedVariant}
                    highestRatedVariant={this.state.highestRatedVariant}
                    highestRatedPlayer={this.state.highestRatedPlayer}
                    excluded={this.state.excluded}
                    loading={this.state.loading}
                //champions={this.state.championsPerVariant}
                />}

                {!loading && validTeam && <div>

                    <div id="leaderboards" className='row'>
                        {this.state.variants.map(vname => (
                            <Tabela key={vname} name={vname}
                                data={this.state.ratings[vname]}
                                averageRating={this.state.averageRatings[vname]}
                                totalGames={this.state.totalGames[vname]}
                                minGames={this.state.minGames}
                                prov={this.state.showProvisionalRatings} />
                        ))}
                    </div>

                    <div id="specialLeaderboards" className='row'>
                        {this.state.specialVariants.map(vname => (
                            <TabelaEspecial key={"special" + vname} name={vname} data={this.state.ratings[vname]}
                                minGames={this.state.minGames}
                                prov={this.state.showProvisionalRatings} />
                        ))}
                    </div>
                </div >}

                {!validTeam && !loading && 
                <div className="alert alert-danger my-5" role="alert">    
                Team not found. Please check the team ID and try again. 
                </div>}

                {!loading && <Filters
                    fixedStatus={this.state.fixedFilters}
                    collapseStatus={this.state.collapseFilters}
                    toggleFilters={this.toggleFiltersTab}
                    updateTeamName={this.handleUpdateTeamName}
                    fetchNewTeam={this.handleFetchNewTeam}
                    changeMinGames={this.handleChangeMinGames}
                    changeProvisional={this.handleToggleProvisional}
                />}

                {!loading && validTeam && <Footer date={this.state.lastUpdate} />}

            </section>)
    } //return

} //class

export default Leaderboards