import React from 'react';
import { perfLabel } from '../utils/stats.js';

const formatDate = (ms) => new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

class TeamHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { input: props.teamId || '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ input: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const id = this.state.input.trim().toLowerCase();
        if (id && !this.props.loading) this.props.onSearch(id);
    }

    render() {
        const {
            teamId, teamInfo, membersCount, excluded, lastJoined, firstJoinedAt, loading, variants = []
        } = this.props;

        const name = (teamInfo && teamInfo.name) || teamId;
        const description = (teamInfo && teamInfo.description) || '';

        return (
            <>
                <header className="site-header">
                    <div className="site-bar">
                        <div className="site-brand">Lichess team ratings</div>
                        <form className="team-search" onSubmit={this.handleSubmit} role="search">
                            <label htmlFor="team-search">Look up another team</label>
                            <div className="team-search-controls">
                                <input
                                    id="team-search"
                                    type="text"
                                    className="team-search-input"
                                    placeholder="Enter a Lichess team ID"
                                    value={this.state.input}
                                    onChange={this.handleChange}
                                    disabled={loading}
                                />
                                <button type="submit" className="team-search-button" disabled={loading}>
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </header>

                <section className="team-overview content-shell" aria-label="Team overview">
                    <div className="team-overview-head">
                        <div className="md:pe-12">
                            <h1 className="team-title">
                                <a href={`https://lichess.org/team/${teamId}`} target="_blank" rel="noopener noreferrer">
                                    {name}
                                </a>
                            </h1>
                            <p className="team-subtitle py-4 md:pe-12">{description}</p>
                        </div>
                    </div>

                    <dl className="team-facts">
                        <div className="team-fact">
                            <dt>Players</dt>
                            <dd>
                                {membersCount ?? 'N/D'}
                                {excluded > 0 &&
                                    <span className="excluded-count" title="Accounts excluded for terms of service violations">
                                        {' '}(+{excluded} excluded)
                                    </span>}
                            </dd>
                        </div>
                        <div className="team-fact">
                            <dt>{teamInfo && teamInfo.createdAt ? 'Created' : 'First member joined'}</dt>
                            <dd>
                                {teamInfo && teamInfo.createdAt
                                    ? formatDate(teamInfo.createdAt)
                                    : firstJoinedAt ? formatDate(firstJoinedAt) : 'N/D'}
                            </dd>
                        </div>
                        <div className="team-fact">
                            <dt>Latest player</dt>
                            <dd>
                                {lastJoined
                                    ? <>
                                        <a href={`https://lichess.org/@/${lastJoined.id}`} target="_blank" rel="noopener noreferrer">
                                            {lastJoined.name}
                                        </a>
                                        <span className="latest-join-date">
                                            {' '}· {formatDate(lastJoined.joinedTeamAt)}
                                        </span>
                                    </>
                                    : 'N/D'}
                            </dd>
                        </div>
                    </dl>
                </section>
            </>
        );
    }
}

export default TeamHeader;
