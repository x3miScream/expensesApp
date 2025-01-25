import React from 'react';
import {GridComponent, 
    ColumnsDirective, 
    ColumnDirective,
    Page,
    Inject} from '@syncfusion/ej2-react-grids';
import data from '../../Data/GridDataSource.json';

var CustomDataGrid = (props) => {
    let {dataSource, columnsDirective} = props;

    data = dataSource;
    let columnsSettings = columnsDirective === undefined ? [] : columnsDirective;

    return(
        <GridComponent dataSource={data}
            allowPaging={true}
            pageSettings={{pageSize: 10 }}>
            
                {columnsSettings?.length === 0 ? <></>
                : 
                    <ColumnsDirective>
                        {columnsSettings.map((item, index) => {
                            return <ColumnDirective key={index} field={item.field} headerText={item.headerText}
                                textAlign={item.textAlign} width={item.width} template={item.template} visible={item.visible} type={item.type} format={item.format}>
                            </ColumnDirective>
                        })}
                    </ColumnsDirective>
                }
            

            <Inject services={[Page]}></Inject>
        </GridComponent>
    )
};

export default CustomDataGrid;