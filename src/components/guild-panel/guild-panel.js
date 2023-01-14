import React, {Component} from "react";

import './guild-panel.css'
import SwapiService from "../../services/swapi-service";
import LoadSpinner from "../load-spinner";
import ErrorPanel from "../error-panel";

export default class GuildPanel extends Component {

    swapi = new SwapiService();

    state = {
        guilds: [],
        loaded: false,
        chosenId: 0,
        chosenName: '',
        error: false,
        errorMessage: '',
        success: false
    }

    componentDidMount() {
        this.getGuilds();
    }

    onError = (message) => {
        this.setState({
            error: true,
            errorMessage: message,
            success: false
        })
    }

    getGuilds = () => {
        this.swapi.getAllGuilds()
            .then((res) => {
                this.setState({
                    guilds: res,
                    loaded: true
                })
            })
    }

    onGuildChoice = (guild) => {
        this.setState({
            chosenId: guild.id,
            chosenName: guild.name
        })
    }

    createGuildsList = (info) => {
        let rows = [];
        let id = 1;

        info.forEach((el) => {
            const { name, memberCount } = el;

            rows.push(
                <li className="list-group-item panel"
                    key={id++}
                    onClick={() => this.onGuildChoice(el)}>
                    Гильдия "{name}": число участников: {memberCount}
                </li>
            )
        })

        return <ul className="list-group head-li">{rows}</ul>
    }

    processState = () => {
        this.setState({
            success: true,
            error: false
        })
    }

    leaveGuild = () => {
        const id = this.props.id;
        this.swapi.leaveGuild(id)
            .then(this.processState)
            .catch((res) => this.onError(res.message));
    }

    joinGuild = () => {
        const id = this.props.id;
        this.swapi.joinGuild(id, this.state.chosenId)
            .then(this.processState)
            .catch((res) => this.onError(res.message));
    }

    render() {

        const guilds = (this.state.loaded) ? this.createGuildsList(this.state.guilds) : <LoadSpinner/>
        const errorPanel = (this.state.error) ? <ErrorPanel errorMessage={this.state.errorMessage}/> : null;
        const successPanel = (this.state.success) ? (
            <span className="success-state">Успешно!</span>
        ) : null;

        const choice = this.state.chosenName;

        return(
            <div className="guild-panel">
                {guilds}
                <span className="guild-label">
                    Текущий выбор: {choice}
                </span>
                <div className="btn-guild">
                    <button className="btn"
                            onClick={this.joinGuild}>Вступить</button>
                    <button className="btn"
                            onClick={this.leaveGuild}>Уйти</button>
                </div>
                {errorPanel}
                {successPanel}
            </div>
        )
    }
}