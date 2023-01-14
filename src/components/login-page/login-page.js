import React, { Component } from "react";

import './login-page.css'

import ErrorPanel from "../error-panel";
import SwapiService from "../../services/swapi-service";
import {Navigate} from "react-router-dom";

export default class LoginPage extends Component {
    state = {
        login: '',
        password: '',
        error: false,
        errorMessage: '',
        isAuth: false
    }

    swapi = new SwapiService();

    onChangeLogin = (e) => {
        this.setState({
            login: e.target.value
        });
    };
    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    onLoginSuccess = (user) => {
        const { money } = user;
        localStorage.setItem('roleMoney', money);
        localStorage.setItem('user', JSON.stringify(user));
        this.setState({
                isAuth: true
        });
    }

    validateData = (login, password) => {
        return (login.trim() === '' || password.trim() === '');
    };

    onError = (message) => {
        this.setState({
            error: true,
            errorMessage: message
        });
    }

    onSubmit = (e) => {
        e.preventDefault();

        const { login, password } = this.state;
        this.setState({
            error: false
        })

        if (this.validateData(login, password)){
            this.setState({
                error: true,
                errorMessage: 'Login or password can\'t be empty'
            });
        }
        else {
            this.swapi.loginUser(login, password)
                .then(this.onLoginSuccess)
                .catch((err) => this.onError(err.message));
        }
    };

    render() {

        const errorPanel = (this.state.error) ? <ErrorPanel errorMessage={this.state.errorMessage}/> : null;
        const redirect = (this.state.isAuth) ? <Navigate to="/user" replace={true}/> : null;

        return(
            <div className="login-page">
                {redirect}
                <h3>Welcome!</h3>
                <form className="login-page-form"
                      onSubmit={this.onSubmit}>
                    <div>
                        <input type="text"
                               className="form-control first"
                               placeholder="login"
                               onChange={this.onChangeLogin}
                               value={this.state.login}/>

                        <input type="text"
                               className="form-control sec"
                               placeholder="password"
                               onChange={this.onChangePassword}
                               value={this.state.password}/>
                    </div>
                    <div className="div-buttons">
                        <button className="btn">
                            Sign in
                        </button>
                    </div>
                </form>
                { errorPanel }
            </div>
        );
    }
}