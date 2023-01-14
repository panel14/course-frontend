import React, { Component } from "react";

import './item-status-window.css'

export default class ItemStatusWindow extends Component {

    createListElem = (id, name, value) => {
        return(
            <li className="list-group-item item" key={id}>
                {name} : {value}
            </li>
        )
    }

    convertItems = (items) => {
        let arr = [];
        let id = 2;

        items.forEach((item) => {
            const key = Object.keys(item);
            arr.push(
                this.createListElem(id++, key, item[key])
            );
        });

        return arr;
    };

    render() {

        const { name, items } = this.props;
        const listedItems = this.convertItems(items);

        return(
            <div className="item-status-window">
                <ul className="list-group">
                    <li className="item-name list-group-item"
                        key="1">{name}</li>
                    {listedItems}
                </ul>
            </div>
        );
    }
}