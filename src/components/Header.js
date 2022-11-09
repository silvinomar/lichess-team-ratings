import React from 'react'
import {Team} from '../utils/functions.js'


const Header = () => {
    return (
        <header className='container'>
            <h5 className='team-name py-5 mb-2'>
                Lichess team:
                <a href={"https://www.lichess.org/team/" + Team()} target="_blank">
                    <small className="pl-2">{Team()}</small>
                </a>
            </h5>
        </header>
    )
}

export default Header