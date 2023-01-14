import React from "react";

import './side-bar.css'
const SideBar = ({elements, onClick}) => {

    const createdItems = elements.map((el) => {
        const {id, item} = el;
        return(
            <li key={id}
                className="item-li"
                onClick={() => onClick(id)}>
                {item}
            </li>
        );
    });

    return(
        <div className="side-bar">
            <ul className="list-group side-bar-list">
                <li key="100"
                    className="head-li">Menu</li>
                {createdItems}
            </ul>
        </div>
    );
}
export default SideBar;