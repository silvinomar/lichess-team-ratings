import React, { Component } from 'react';

class ProgressBar extends Component {
    render() {
        const { progress, loaded, total } = this.props;

        return (
            <div className="px-4 py-3 progress-bar-container mb-5">
                <p className="lead">Getting details from {loaded} of {total} players...</p>
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                >
                    
                </div>
            </div>
        );
    }
}

export default ProgressBar;