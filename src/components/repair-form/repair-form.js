import React, { Component } from "react";

import './repair-form.css'
import SwapiService from "../../services/swapi-service";
import ItemsService from "../../services/items-service";
import ContentTable from "../content-table";
import ErrorPanel from "../error-panel";
export default class RepairForm extends Component {

    swapi = new SwapiService();
    items = new ItemsService();

    detailType = {
        NULL: 0,
        ENGINE: 1,
        BODY: 2,
        WHEELS: 3,
        GEARBOX: 4
    }

    detailTypeStr = {
        0: 'NULL',
        1: 'ДВИГАТЕЛь',
        2: 'КОРПУС',
        3: 'КОЛЁСА',
        4: 'КОРОБКА ПЕРЕДАЧ'
    }

    _headersOrders = this.items.orderTableHeaders;
    _headersDetail = this.items.detailsTableHeaders;

    state = {
        headers: [],
        data: [],
        caption: '',
        isOpen: false,
        orders: [],
        details: [],
        curOrders: [],
        curDetails: [],
        form: [null, null, null, null, null],
        detailsOpen: false,
        type: this.detailType.NULL,
        error: false,
        errorMessage: '',
        success: false,
        successMessage: ''
    }

    componentDidMount() {
        this.getOrders();
        this.getDetails();
    }

    onError = (message) => {
        this.setState({
            error: true,
            errorMessage: message
        })
    }

    onDetailChoice = (el) => {
        const {id, type} = el;
        const filtered = this.state.details.filter(el => el.id !== id);
        this.setState({
            curDetails: filtered
        });

        if (type !== this.detailTypeStr[this.state.type]) {
            this.onError('Это неподходящая деталь!');
            return;
        }

        this.setState({
            error: false
        })

        const curDetails = this.state.form;
        curDetails[this.state.type] = el

        this.setState({
            form: curDetails,
        });
    }

    createDetailsList = (info) => {
        let rows = [];
        let id = 0;


        info.forEach((detail) => {
            const { type, status, name, level, cost} = detail
            rows.push(
                <li key={id++}
                    className="list-group-item panel"
                    onClick={() => this.onDetailChoice(detail)}>
                    Деталь {id}: {type}, {status}, {name}, {level}, {cost}
                </li>
            );
        })

        return <ul className="list-group details">{rows}</ul>;
    }

    afterOrders = (info) => {

        this.setState({
            orders: info
        });
    }

    afterDetails = (info) => {

        this.setState({
            details: info
        })
    }

    getOrders = () => {
        const id = this.props.id;
        this.swapi.getAllOrders(id)
            .then(this.afterOrders)
    }

    getDetails = () => {
        const id = this.props.id;
        this.swapi.getOwnDetails(id)
            .then(this.afterDetails)
    }

    showOrders = () => {
        const data = this.items.createOrdersTable(this.state.orders);
        this.setState({
            headers: this._headersOrders,
            data: data,
            caption: 'Заказы',
            isOpen: true,
            detailsOpen: false,
            error: false
        })
    }

    showFullDetails = (type) => {
        const filtered = this.state.details.filter(el => el.type === this.detailTypeStr[type])
        const detailsOpen = (filtered.length > 0);
        const data = this.items.createDetailsTable(filtered);
        this.setState({
            headers: this._headersDetail,
            data: data,
            caption: 'Детали',
            isOpen: false,
            detailsOpen: detailsOpen,
            type: type,
            error: false
        })
    }

    getDetailName = (type) => {
        return (this.state.form[type] === null) ? ''
            :`${this.state.form[type].name}`;
    }

    onTableClick = (row) => {
        const orderIdx = parseInt(row[0]);
        const el = this.state.orders.find(el => el.id === orderIdx);
        const curForm = this.state.form;
        curForm[0] = el;

        this.setState({
            form: curForm
        });

        console.log(el);
    }

    processRepair = () => {
        this.setState({
            success: true,
            successMessage: 'Заказ выполнен успешно!'
        });

        const cost = this.state.form[0].cost;
        this.props.changeMoney(cost);
    }

    submitForm = () => {
        const order = this.state.form;
        const request = {
            orderId: order[0].id,
            newEngineId: order[1].id,
            newWheelsId: order[2].id,
            newGearBoxId: order[3].id,
            newBodyId: order[4].id
        }

        this.swapi.repairCar(request)
            .then(this.processRepair)
            .catch((res) => this.onError(res.message));
    }

    render() {

        const table = (this.state.isOpen) ? <ContentTable headers={this.state.headers}
                                                          data={this.state.data}
                                                          caption={this.state.caption}
                                                          onClick={this.onTableClick}/> : null;

        const errorPanel = (this.state.error) ? <ErrorPanel errorMessage={this.state.errorMessage}/> : null;

        const details = (this.state.detailsOpen) ? this.createDetailsList(this.state.details) : null;

        const orderName = (this.state.form[0] === null) ? '' : this.state.form[0].id;
        const engineName = this.getDetailName(this.detailType.ENGINE);
        const bodyName = this.getDetailName(this.detailType.BODY);
        const wheelsName = this.getDetailName(this.detailType.WHEELS);
        const gearboxName = this.getDetailName(this.detailType.GEARBOX);

        return(
            <div className="repair-form d-flex">
                <ul className="list-group">
                    <li className="list-group-item head-li">Починка:</li>
                    <li className="list-group-item panel"
                        onClick={this.showOrders}>Заказ: {orderName}</li>
                    <li className="list-group-item panel"
                        onClick={() => this.showFullDetails(this.detailType.ENGINE)}>Двигатель: {engineName}</li>
                    <li className="list-group-item panel"
                        onClick={() => this.showFullDetails(this.detailType.BODY)}>Корпус: {bodyName}</li>
                    <li className="list-group-item panel"
                        onClick={() => this.showFullDetails(this.detailType.WHEELS)}>Колеса: {wheelsName}</li>
                    <li className="list-group-item panel"
                        onClick={() => this.showFullDetails(this.detailType.GEARBOX)}>Коробка передач: {gearboxName}</li>
                </ul>
                {table}
                {details}
                {errorPanel}
                <button className="btn repair-button" onClick={this.submitForm}>Починить</button>
            </div>
        )
    }
}