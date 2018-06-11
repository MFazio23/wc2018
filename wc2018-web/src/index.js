import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter, Route} from "react-router-dom";
import withGA from './WithGA'

ReactDOM.render(
    <BrowserRouter>
        <Route component={withGA(App)} />
    </BrowserRouter>,
    document.getElementById('root'));
registerServiceWorker();