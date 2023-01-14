import React from "react";

import './error-panel.css'

const ErrorPanel = ({errorMessage}) => {
    return(
        <div className="error-panel">
            <span>ERROR: {errorMessage}</span>
        </div>
    );
}

export default ErrorPanel;