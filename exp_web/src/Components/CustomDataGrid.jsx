import React from 'react';
import {GridComponent, 
    ColumnsDirective, 
    ColumnDirective,
    Page,
    Inject} from '@syncfusion/ej2-react-grids';
import data from '../Data/GridDataSource.json';

var CustomDataGrid = () => {
    return(
        <GridComponent dataSource={data}
            allowPaging={true}
            pageSettings={{pageSize: 3 }}>
            <ColumnsDirective>
                <ColumnDirective field="OrderID" headerText="Invoice ID" textAlign='Right' width="100"></ColumnDirective>
                <ColumnDirective field="CustomerId" headerText="Customer ID" width="100"></ColumnDirective>
                <ColumnDirective field="ShipCountry" headerText="Ship Country" width="100"></ColumnDirective>
                <ColumnDirective field="ShipName" headerText="Ship Name"></ColumnDirective>
                <ColumnDirective field="Freight" textAlign='Right' width="100"></ColumnDirective>
            </ColumnsDirective>

            <Inject services={[Page]}></Inject>
        </GridComponent>
    )
};

export default CustomDataGrid;