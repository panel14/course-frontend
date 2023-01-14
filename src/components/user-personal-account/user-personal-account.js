import React, { Component } from "react";

import './user-personal-account.css'
import UserAccountHeader from "../user-account-header";
import SideBar from "../side-bar";
import ItemStatusWindow from "../item-status-window";
import SwapiService from "../../services/swapi-service";
import ItemsService from "../../services/items-service";
import LoadSpinner from "../load-spinner";
import MechanicButtonPanel from "../mechanic-button-panel";
import ClientButtonPanel from "../client-button-panel";
export default class UserPersonalAccount extends Component {

    swapi = new SwapiService();
    itemService = new ItemsService();

    mechanicRequests = {
        guildId: this.swapi.getGuildInfo,
        details: this.swapi.getOwnDetails,
        garageId: this.swapi.getGarageInfo
    }

    state = {
        role: '',
        sideBarItems: [
            {id: 0, item: 'item'}
        ],
        itemId: 0,
        itemsValues: [],
        windowItem: [],
        dialogWindowOpen: false,
        tableOpen: false,
        loading: true,
        money: 0
    }

    componentDidMount() {
        const {id, roleDto:{name:role} } = JSON.parse(localStorage.getItem('user'));
        let dataFunc, setSideBarItems, setItemsValues = null;

        if (role === 'КЛИЕНТ') {
            dataFunc = this.swapi.getClientInfo;
            setSideBarItems = this.itemService.getClientSideBarItems;
            setItemsValues = this.itemService.getClientItemValues;
        }
        else {
            dataFunc = this.swapi.getMechanicInfo;
            setSideBarItems = this.itemService.getMechanicSideBarItems;
            setItemsValues = this.itemService.getMechanicItemValues;
        }

        dataFunc(id)
            .then((info) => {

                const {id: updatedId} = info;

                this.setState({
                    role: role,
                    sideBarItems: setSideBarItems(),
                    itemsValues: setItemsValues(info),
                    loading: false
                });
                localStorage.setItem('roleInfo', JSON.stringify(info));
                localStorage.setItem('roleId', updatedId);
                this.setState({
                    money: JSON.parse(localStorage.getItem('roleMoney'))
                })
            });
    }

    parseWindowItem = (info, index) => {
        const result = this.itemService.parsers[index](info);
        this.setState({
            windowItem: result
        })
    }

    onSideBarClick = (id) => {
        this.setState({
            itemId: id,
            dialogWindowOpen: true
        });

        const rawItem = this.state.itemsValues[id];
        if (rawItem['needInfo']) {
            const index = Object.keys(rawItem)[0]
            const method = this.mechanicRequests[index];

            let methodIndex = rawItem[index];

            if (index === 'details')  methodIndex = localStorage.getItem('roleId');

            method(methodIndex)
                .then((res) => this.parseWindowItem(res, index));
        }
        else {
            const key = Object.keys(rawItem)[0];
            this.setState({
                windowItem: [{[key] : rawItem[key]}]
            })
        }
    };

    moneyChange = (sub) => {
        let balance = JSON.parse(localStorage.getItem('roleMoney'));
        balance += sub;
        if (balance > 0) {
            localStorage.setItem('roleMoney', balance);
            this.setState({
                money: balance
            })
        }
    }

    render() {

        const { item: name } = this.state.sideBarItems[this.state.itemId];
        const money = JSON.parse(localStorage.getItem('roleMoney'));

        const window = (this.state.dialogWindowOpen)
            ? <ItemStatusWindow name={`${name} info:`}
                                items={this.state.windowItem}/>
            : null;

        const sideBar = (this.state.loading)
            ? <LoadSpinner/>
            : <SideBar elements={this.state.sideBarItems}
                       onClick={this.onSideBarClick}/>

        const panel = (this.state.role === 'КЛИЕНТ') ? <ClientButtonPanel moneyChange={this.moneyChange}/>
                                                        : <MechanicButtonPanel moneyChange={this.moneyChange}/>
        const buttonPanel = (this.state.loading) ? <LoadSpinner/> : panel

        return(
          <div className="user-personal-account">
              <UserAccountHeader money={money}/>
              <div className="d-flex">
                  {sideBar}
                  {window}
                  {buttonPanel}
              </div>
          </div>
        );
    }
}