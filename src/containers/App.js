import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { HashRouter } from 'react-router-dom'

import './css/bootstrap.min.css';
import './css/estilos.css';

import Home from '../Pages/Home.js'
import VariantPage from '../Pages/VariantPage.js'


function App(){

    return(
        //Rotas
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='variant/:name/:n' element={<VariantPage/>}/>
                <Route path="lichess-team-ratings/*" element={<Home />} />
            </Routes>
        </HashRouter>
    )
}


export default App;