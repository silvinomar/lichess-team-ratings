import React, { Component } from 'react';
import {
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";

import './css/bootstrap.min.css';
import './css/estilos.css';
import Leaderboards from '../components/Leaderboards.js'


function App() {

    return (
        //Rotas
        <HashRouter>
            <Routes>
                <Route path="/" element={<Leaderboards />} />
            </Routes>

        </HashRouter>
    )
}


export default App;