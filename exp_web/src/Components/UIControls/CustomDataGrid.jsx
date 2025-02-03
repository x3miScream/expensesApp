import React, {useLayoutEffect} from 'react';
import {GridComponent, 
    ColumnsDirective, 
    ColumnDirective,
    Page,
    Toolbar,
    Edit,
    Inject} from '@syncfusion/ej2-react-grids';

var CustomDataGrid = (props) => {
    let {dataSource, allowEditing, allowAdding, allowDeleting, toolbarOptions, columnsDirective} = props;

    const editOptions = { 
        allowEditing: allowEditing === undefined ? false : allowEditing,
        allowAdding: allowAdding === undefined ? false : allowAdding,
        allowDeleting: allowDeleting === undefined ? false : allowDeleting
    };

    const data = dataSource;

    let columnsSettings = columnsDirective === undefined ? [] : columnsDirective;

    return(
        <GridComponent dataSource={data}
            allowPaging={true}
            pageSettings={{pageSize: 10 }}
            editSettings={editOptions}
            toolbar={toolbarOptions === undefined ? [''] : toolbarOptions}
            >
            
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
            

            <Inject services={[Page, Edit, Toolbar]}></Inject>
        </GridComponent>
    )
};

export default CustomDataGrid;