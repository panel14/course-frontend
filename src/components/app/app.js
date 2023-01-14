import React, { Component } from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import './app.css'
import LoginPage from "../login-page";
import UserPersonalAccount from "../user-personal-account";


export default class App extends Component {

    render() {
        return(
            <div className="course app">
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/log" element={<LoginPage />} />
                        <Route path="/user" element={<UserPersonalAccount />} />
                    </Routes>
                </Router>
            </div>
        );
    }
}