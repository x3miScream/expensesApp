import React, { Fragment } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

const CustomDropDown = (props) => {
    const {id, dataSource, fields, allowObjectBinding, value, onChange} = props;

    return(<Fragment>
        <DropDownListComponent 
            id={id} 
            dataSource={dataSource} 
            fields={fields}
            value={value}
            allowObjectBinding={allowObjectBinding}
            onChange={onChange}/>
    </Fragment>);
};

export default CustomDropDown;