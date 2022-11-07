import React, { Component } from 'react';
import { BrowserRouter as HashRouter, Routes, Route} from 'react-router-dom'

import './css/bootstrap.min.css';
import './css/estilos.css';

import Home from '../Pages/Home.js'
import VariantPage from '../Pages/VariantPage.js'


function App(){

    return(
        //Rotas
        <HashRouter>
            <Routes>
                 <Route path='/lichess-team-ratings' element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path='/variant/:name/:n' element={<VariantPage/>}/>
                <Route path="/*" element={<Home />} />
            </Routes>
        </HashRouter>
    )
}


export default App;