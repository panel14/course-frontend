import React, {Component, Fragment} from "react";

import './content-table.css'
export default class ContentTable extends Component {

    id = 1;

    createTableRow = (rowData) => {
        return rowData.map((el) => {
            return(
                <td key={this.id++}>{el}</td>
            );
        })
    }
    createTableHead = (headers) => {
        return headers.map((el) => {
            return(
                <th key={this.id++} scope="col">{el}</th>
            );
        });
    };

    createTableBody = (data) => {
        return data.map((el) => {
            return(
                <tr key={this.id++}
                    onClick={() => this.props.onClick(el)}
                    className="row-tr">
                    {this.createTableRow(el)}
                </tr>
            );
        });
    };
     render() {

         const { headers, data, caption } = this.props;

         return(
             <Fragment>
                 <table className="table table-bordered content-table">
                     <caption>{caption}</caption>
                     <thead className="table-head">
                     <tr>
                         {this.createTableHead(headers)}
                     </tr>
                     </thead>
                     <tbody>
                     {this.createTableBody(data)}
                     </tbody>
                 </table>
             </Fragment>
         );
     }
}
