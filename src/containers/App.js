import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import './css/bootstrap.min.css';
import './css/estilos.css';

import Home from '../Pages/Home.js'
import VariantPage from '../Pages/VariantPage.js'


function App(){

    return(
        //Rotas
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='lichess-team-ratings/variant/:name/:n' element={<VariantPage/>}/>
                <Route path="lichess-team-ratings/*" element={<Home />} />
            </Routes>
        </Router>
    )
}


export default App;