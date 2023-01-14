import React, {Component} from "react";

import './user-account-header.css'
import {Link} from "react-router-dom";
import SwapiService from "../../services/swapi-service";
export default class UserAccountHeader extends Component{

    swapi = new SwapiService();

    logout = () => {
        const userData = localStorage.getItem('user');
        const { token } = JSON.parse(userData);

        this.swapi.logoutUser(token)
            .then(() => console.log('User log out'))
    }

    render() {
        const userData = localStorage.getItem('user');
        const {id, humanDto: {name, surname}, roleDto:{name:role}} = JSON.parse(userData);
        //const money = JSON.parse(localStorage.getItem('roleMoney'));

        return(
            <div className="user-account-header d-flex">
                <div className="user-data">
                    <h5>{name} {surname}: {role}</h5>
                    <h6>User ID: {id}</h6>
                    <h6>Деньги: {this.props.money}</h6>
                </div>

                <div className="logo">
                    <h1>Тачка на прокачку</h1>
                </div>
                <Link to="/log"
                      onClick={this.logout}>log out</Link>
            </div>
        );
    }
}