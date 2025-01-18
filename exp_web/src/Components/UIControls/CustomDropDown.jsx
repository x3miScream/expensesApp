import React, { Fragment } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

const CustomDropDown = (props) => {
    const {dataSource, fields, allowObjectBinding, value, onChange} = props;

    return(<Fragment>
        <DropDownListComponent 
            id='ddlelement' 
            dataSource={dataSource} 
            fields={fields}
            value={value}
            allowObjectBinding={allowObjectBinding}
            onChange={onChange}/>
    </Fragment>);
};

export default CustomDropDown;