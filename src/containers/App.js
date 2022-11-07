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
                <Route path='lichess-team-ratings/variant/:name/:n' element={<VariantPage/>}/>
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    )
}


export default App;