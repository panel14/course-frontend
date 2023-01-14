import React, {Component, Fragment} from "react";

import './mechanic-button-panel.css'
import SwapiService from "../../services/swapi-service";
import ItemsService from "../../services/items-service";
import ContentTable from "../content-table";
import ErrorPanel from "../error-panel";
import RepairForm from "../repair-form";
import GuildPanel from "../guild-panel";

export default class MechanicButtonPanel extends Component {
    buttonEnum = {
        DETAIL: 1,
        DECOR: 2,
        ORDER: 3,
        NONE: 4
    }

    state = {
        roleId: 0,
        isTbl: false,
        headers: [],
        data: [],
        caption: '',
        button: '',
        isBtnHide: true,
        choice: [],
        error: false,
        errorText: '',
        showTaxi: false,
        taxiResponse: '',
        buyingString: '',
        showRepair: false,
        showGuild: false
    }
    swapi = new SwapiService();
    itemsService = new ItemsService();

    componentDidMount() {
        console.log(JSON.parse(localStorage.getItem('roleId')));
        this.setState({
            roleId: JSON.parse(localStorage.getItem('roleId'))
        })
    }

    processState = (headers, data, caption, button) => {
        this.setState({
            isTbl: true,
            headers: headers,
            caption: caption,
            data: data,
            button: button,
            isBtnHide: true,
            error: false,
            showTaxi: false,
            buyingString: '',
            showRepair: false,
            showGuild: false
        })
    }

    processCars = (carsInfo) => {
        const headers = this.itemsService.carTableHeaders;
        const data = this.itemsService.createCarsTable(carsInfo);

        this.processState(headers, data, 'Тачки', this.buttonEnum.NONE);
    }

    processDetails = (detailsInfo) => {
        const headers = this.itemsService.detailsTableHeaders;
        const data = this.itemsService.createDetailsTable(detailsInfo);

        this.processState(headers, data, 'Магазин деталей', this.buttonEnum.DETAIL)
    }

    processShops = (shopsInfo) => {
        const headers = this.itemsService.decorTableHeaders;
        const data = this.itemsService.createDecorTable(shopsInfo);

        this.processState(headers, data, 'Магазин декора', this.buttonEnum.DECOR)
    }

    processBuying = (rowInd, method) => {
        this.props.moneyChange(-parseInt(this.state.choice[rowInd]))
        method();

        this.setState({
            buyingString: 'Успешно!'
        });
    }

    showAllCars = () => {
        const {id} = JSON.parse(localStorage.getItem('user'));
        this.swapi.getUsersCar(id)
            .then(this.processCars);
    }

    showDetailsMarket = () => {
        this.swapi.getAllDetails()
            .then(this.processDetails)
    }

    showOrders = () => {
        this.setState({
            isTbl: false,
            isBtnHide: true,
            showRepair: true,
            showGuild: false
        })
    }

    showDecorMarket = () => {
        this.swapi.getAllShops()
            .then(this.processShops)
    }

    onTableRowClick = (row) => {
        this.setState({
            isBtnHide: false,
            choice: row,
            buyingString: ''
        })
    }

    buySome = () => {
        const id = this.state.roleId;
        const itemId = parseInt(this.state.choice[0]);

        switch (this.state.button) {
            case this.buttonEnum.DECOR:

                this.swapi.buyDecor(id, itemId)
                    .then(() => this.processBuying(1, this.showDecorMarket))
                    .catch((res) => this.processError(res.message));
                break;

            case this.buttonEnum.DETAIL:

                this.swapi.buyDetail(id, itemId)
                    .then(() => this.processBuying(5, this.showDetailsMarket))
                    .catch((res) => this.processError(res.message));
                break;
            default:
                break;
        }
    }

    createButton = () => {
        if (this.state.button === this.buttonEnum.NONE)
            return null;

        return(
            <button className="btn buy-btn"
                    onClick={this.buySome}>
                Купить
            </button>
        )
    }

    showTaxiPanel = () => {
        this.setState({
            isTbl: false,
            isBtnHide: true,
            showTaxi: true,
            showGuild: false
        });
    }

    showGuildPanel = () => {
        this.setState({
            isTbl: false,
            isBtnHide: true,
            showTaxi: false,
            showGuild: true,
            showRepair: false
        })
    }

    processTaxi = (state, response, isPay) => {
        if (response) {
            this.setState({
                taxiResponse: `${state} Успешно!`
            });
        }

        if (isPay) {
            this.props.moneyChange(250);
        }
    }

    processError = (message) => {
        this.setState({
            error: true,
            errorText: message
        })
    }

    startTaxi = () => {
        const {id} = JSON.parse(localStorage.getItem('user'));

        this.swapi.startWork(id)
            .then((response) => this.processTaxi('Начать работать:', response, false))
            .catch((res) => this.processError(res.message))
    }

    stopTaxi = () => {
        const {id} = JSON.parse(localStorage.getItem('user'));

        this.swapi.stopWork(id)
            .then((response) => this.processTaxi('Остановиться:', response, true))
            .catch((res) => this.processError(res.message))
    }

    createTaxiPanel = () => {
        return(
            <div className="taxi-panel">
                <span>Такси</span>
                <div>
                    <button className="btn taxi-btn" onClick={this.startTaxi}>Начать работать</button>
                    <button className="btn taxi-btn" onClick={this.stopTaxi}>Остановиться</button>
                </div>
                <span>{this.state.taxiResponse}</span>
            </div>
        );
    }

    render() {

        const table = (this.state.isTbl) ? <ContentTable headers={this.state.headers}
                                                         data={this.state.data}
                                                         caption={this.state.caption}
                                                         onClick={this.onTableRowClick}/> : null;

        const btn = (this.state.isBtnHide) ? null : this.createButton()
        const error = (this.state.error) ? <ErrorPanel errorMessage={this.state.errorText}/> : null;
        const taxiPanel = (this.state.showTaxi) ? this.createTaxiPanel() : null;
        const statusString = (this.state.buyingString === '') ? null : (
            <span className="status-string">{this.state.buyingString}</span>
        )

        const repair = (this.state.showRepair) ? <RepairForm id={this.state.roleId}
                                                             changeMoney={this.props.moneyChange}/> : null;

        const guildPanel = (this.state.showGuild) ? <GuildPanel id={this.state.roleId}/> : null;

        return(
            <Fragment>
                <div className="mechanic-button-panel d-flex">
                    <ul className="list-group">
                        <li className="list-group-item panel-header">
                            Действия:
                        </li>
                        <li className="list-group-item panel" onClick={this.showAllCars}>
                            Показать машины
                        </li>
                        <li className="list-group-item panel" onClick={this.showDetailsMarket}>
                            В магазин деталей
                        </li>
                        <li className="list-group-item panel" onClick={this.showOrders}>
                            Перейти к заказам
                        </li>
                        <li className="list-group-item panel" onClick={this.showDecorMarket}>
                            В магазин декора
                        </li>
                        <li className="list-group-item panel" onClick={this.showTaxiPanel}>
                            Такси
                        </li>
                        <li className="list-group-item panel" onClick={this.showGuildPanel}>
                            Гильдии
                        </li>
                    </ul>
                    {table}
                    {repair}
                </div>
                {btn}
                {statusString}
                {taxiPanel}
                {guildPanel}
                {error}
            </Fragment>
        )
    }
}