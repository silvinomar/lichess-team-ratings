import React, { Component } from 'react';
import {
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";

import './css/bootstrap.min.css';
import './css/estilos.css';

import Home from '../Pages/Home.js'
import VariantPage from '../Pages/VariantPage.js'
import { Variants } from '../utils/Variants.js'

function App() {

    return (
        //Rotas
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                {Variants().map(vname =>
                    <Route path={'/' + vname}
                        element={<VariantPage variantName={vname} />} key={vname}/>
                )}

            </Routes>

        </HashRouter>
    )
}


export default App;