import React from "react";

import './app-header.css'

const AppHeader = () => {
    return(
        <div className="app-header d-flex">
            <div className="names">
                <h5>Гониченко Николай</h5>
                <h5 >Верзаков Александр</h5>
            </div>

            <h5 className="group">
                Группа P33302
            </h5>
        </div>
    );
}

export default AppHeader;