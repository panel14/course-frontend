import React, {Component, Fragment} from "react";

import './order-form.css'
import SwapiService from "../../services/swapi-service";
import ItemsService from "../../services/items-service";
import ContentTable from "../content-table";
import ErrorPanel from "../error-panel";

export default class OrderForm extends Component {

    swapi = new SwapiService();
    itemsService = new ItemsService();

    state = {
        isOpen: false,
        carHeaders: [],
        carData: [],
        carsDto: null,
        mechanicHeaders: [],
        mechanicData: [],
        mechanicsDto: null,
        choice: {
            mechanic: null,
            mCh: false,
            car: null,
            cCh: false
        },
        cost: '0',
        error: false,
        errorMessage: '',
        success: false
    }

    componentDidMount() {

        this.createCarTable();
        this.createMechanicTable();

        this.setState({
            isOpen: true
        })
    }

    processMechanics = (info) => {
        const headers = this.itemsService.availableMechanicsTableHeaders;
        const data = this.itemsService.createAvailableMechanicsTable(info);

        this.setState({
            mechanicHeaders: headers,
            mechanicData: data,
            mechanicsDto: info
        })
    }

    createMechanicTable = () => {
        this.swapi.getAvailableMechanics()
            .then(this.processMechanics)
    }

    processCars = (info) => {
        const headers = this.itemsService.carTableHeaders;
        const data = this.itemsService.createCarsTable(info);

        this.setState({
            carHeaders: headers,
            carData: data,
            carsDto: info
        })
    }

    createCarTable = () => {
        const {id} = JSON.parse(localStorage.getItem('user'));
        this.swapi.getUsersCar(id)
            .then(this.processCars)
    }

    parseUserToString = (user) => {
        return `${user.humanDto.name} ${user.humanDto.surname}`
    }

    parseMechanicToString = () => {
        return `${this.state.choice.mechanic.name} ${this.state.choice.mechanic.surname}`
    }

    parseCarToString = () => {
        return `${this.state.choice.car.mark} ${this.state.choice.car.name}`
    }

    onMechanicChoice = (row) => {
        const index = parseInt(row[0]);

        this.state.mechanicsDto.forEach((item) => {
            if (item.id === index){
                this.setState((state) => {
                    return {
                        choice: {
                            mechanic: item,
                            mCh: true,
                            car: state.choice.car,
                            cCh: state.choice.cCh
                        }
                    }
                });
            }
        })
    }

    onCarChoice = (row) => {
        const index = parseInt(row[0]);
        console.log(this.state.carsDto);
        this.state.carsDto.forEach((item) => {
            if (item.id === index) {
                this.setState((state) => {
                    return {
                        choice: {
                            mechanic: state.choice.mechanic,
                            mCh: state.choice.mCh,
                            car: item,
                            cCh: true
                        }
                    }
                });
            }
        })
    }

    onCostChange = (e) => {
        this.setState({
            cost: e.target.value
        })
    }

    processOrder = (cost) => {

        this.props.moneyChange(-cost);

        this.setState({
            error: false,
            success: true
        })
    }

    onError = (message) => {
        this.setState({
            error: true,
            errorMessage: message,
            success: false
        });
    }

    checkCarDto = (car) => {
        const body = car.body.status === 'РАБОЧАЯ';
        const engine = car.engine.status === 'РАБОЧАЯ';
        const wheels = car.wheels.status === 'РАБОЧАЯ';
        const gearbox = car.gearbox.status === 'РАБОЧАЯ';

        return (body && engine && wheels && gearbox);
    }

    sendOrder = () => {

        const cost = parseInt(this.state.cost);
        if (!cost) {
            this.onError('Цена должна быть числом!');
            return;
        }

        if (cost <= 0) {
            this.onError('Цена должна быть больше 0!');
            return;
        }

        if (!this.state.choice.mCh || !this.state.choice.cCh) {
            this.onError('Не все параметры заказа выбраны!');
            return;
        }

        if (this.checkCarDto(this.state.choice.car)) {
            this.onError('У машины нет сломанных деталей!');
            return;
        }

        const request = {
            id: 0,
            mechanic: this.state.choice.mechanic,
            clientDto: JSON.parse(localStorage.getItem('roleInfo')),
            carDto: this.state.choice.car,
            cost: cost,
            date: Date.now()
        }

        this.swapi.createOrder(request)
            .then(() => this.processOrder(cost))
            .catch((err) => this.onError(err.message))
    }

    render() {

        const cTable = (this.state.isOpen) ? <ContentTable headers={this.state.carHeaders}
                                                           data={this.state.carData}
                                                           caption={'Выберите машину'}
                                                           onClick={this.onCarChoice}/> : null

        const mTable = (this.state.isOpen) ? <ContentTable headers={this.state.mechanicHeaders}
                                                           data={this.state.mechanicData}
                                                           caption={'Выберите механика'}
                                                           onClick={this.onMechanicChoice}/> : null

        const error = (this.state.error) ? <ErrorPanel errorMessage={this.state.errorMessage}/> : null
        const success = (this.state.success) ? (<span className="success-state">Успешно!</span>) : null;

        const userStr = this.parseUserToString( JSON.parse(localStorage.getItem('user')));
        const mechStr = (this.state.choice.mCh) ? this.parseMechanicToString(): 'не выбрано'
        const carStr = (this.state.choice.cCh) ? this.parseCarToString(): 'не выбрано'

        return(
            <Fragment>
                <div className="d-flex">
                    <div className="tables-order">
                        {cTable}
                        {mTable}
                    </div>
                    <div className="order-form">
                        <ul className="list-group">
                            <li className="list-group-item head-li">Составление заказа:</li>
                            <li className="list-group-item panel">Клиент: {userStr}</li>
                            <li className="list-group-item panel">Механик: {mechStr}</li>
                            <li className="list-group-item panel">Машина: {carStr}</li>
                            <li className="list-group-item panel">
                                Цена:
                                <input type="text"
                                       placeholder="$$$..."
                                       value={this.state.cost} onChange={this.onCostChange}/>
                            </li>
                            <li className="list-group-item panel">Дата: {Date.now()}</li>
                        </ul>
                        <button className="btn" onClick={this.sendOrder}>
                            Оформить
                        </button>
                    </div>
                </div>
                {error}
                {success}
            </Fragment>
        )
    }
}