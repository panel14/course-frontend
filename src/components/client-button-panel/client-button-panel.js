import React, {Component} from "react";

import './client-button-panel.css'
import SwapiService from "../../services/swapi-service";
import ItemsService from "../../services/items-service";
import ContentTable from "../content-table";
import OrderForm from "../order-form";
export default class ClientButtonPanel extends Component {

    swapi = new SwapiService();
    itemsService = new ItemsService();

    infoType = {
        MECHANIC: 0,
        CARS: 1
    }

    state = {
        isTbl: false,
        headers: [],
        data: [],
        caption: '',
        error: false,
        errorMessage: '',
        choiceMechanic: null,
        orderOpen: false
    }

    processState = (headers, data, caption) => {
        this.setState({
            isTbl: true,
            headers: headers,
            caption: caption,
            data: data,
            error: false,
            orderOpen: false
        })
    }

    formTable = (info, type) => {

        let headers, data;

        switch (type) {

            case this.infoType.MECHANIC:
                headers = this.itemsService.availableMechanicsTableHeaders;
                data = this.itemsService.createAvailableMechanicsTable(info);
                break;

            case this.infoType.CARS:
                headers = this.itemsService.carTableHeaders;
                data = this.itemsService.createCarsTable(info);
                break;

            default:
                break;
        }

        return {
            headers: headers,
            data: data
        }
    }

    processMechanics = (mechanicsInfo) => {
        const {headers, data} = this.formTable(mechanicsInfo, this.infoType.MECHANIC);

        this.processState(headers, data, 'Доступные механики');
    }

    processCars = (carsInfo) => {
        const {headers, data} = this.formTable(carsInfo, this.infoType.CARS);

        this.processState(headers, data, 'Тачки');
    }

    showMechanics = () => {
        this.swapi.getAvailableMechanics()
            .then(this.processMechanics)
    }

    showAllCars = () => {
        const {id} = JSON.parse(localStorage.getItem('user'));
        this.swapi.getUsersCar(id)
            .then(this.processCars);
    }

    createOrder = () => {
        this.setState({
            isTbl: false,
            orderOpen: true
        });
    }

    onTableRowClick = (row) => {
        this.setState({
            choiceMechanic: row
        })
    }

    render() {

        const table = (this.state.isTbl) ? <ContentTable headers={this.state.headers}
                                                         data={this.state.data}
                                                         caption={this.state.caption}
                                                         onClick={this.onTableRowClick}/> : null

        const order = (this.state.orderOpen) ? <OrderForm moneyChange={this.props.moneyChange}/> : null;

        return(
            <div className="client-button-panel d-flex">
                <ul className="list-group">
                    <li className="list-group-item panel-header">
                        Действия:
                    </li>
                    <li className="list-group-item panel" onClick={this.showAllCars}>
                        Показать машины
                    </li>
                    <li className="list-group-item panel" onClick={this.showMechanics}>
                        Показать доступных механиков
                    </li>
                    <li className="list-group-item panel" onClick={this.createOrder}>
                        Создать заказ
                    </li>
                </ul>
                {table}
                {order}
            </div>
        );
    }
}