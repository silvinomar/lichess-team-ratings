import React from "react";
import {
    BrowserRouter,
    Routes, // instead of "Switch"
    Route
} from "react-router-dom";

import './css/bootstrap.min.css';
import './css/estilos.css';
import Leaderboards from '../components/Leaderboards.js'

function App() {

 

    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Leaderboards />} />
            </Routes>


        </BrowserRouter>
    )
}


export default App;