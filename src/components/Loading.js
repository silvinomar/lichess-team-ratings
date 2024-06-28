import React from 'react'

const Loading = (props) => {

    return (
        <div className='loading loading-animation'>
            {props.message}
            <span className="spinner"></span>
        </div>
    )
}

export default Loading