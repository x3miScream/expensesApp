import React, { Fragment } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

const CustomDropDown = (props) => {
    const {id, dataSource, fields, allowObjectBinding, value, enabled, onChange} = props;

    return(
    <DropDownListComponent 
        id={id} 
        dataSource={dataSource} 
        fields={fields}
        value={value}
        allowObjectBinding={allowObjectBinding}
        enabled={enabled}
        onChange={onChange}/>
    // <DropDownListComponent 
    //     id={id} 
    //     fields={{...fields, dataSource: dataSource}}
    //     value={value}
    //     allowObjectBinding={allowObjectBinding}
    //     enabled={enabled}
    //     onChange={onChange}/>
    );
};

export default CustomDropDown;