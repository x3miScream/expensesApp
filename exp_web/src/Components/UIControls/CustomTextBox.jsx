import React from 'react';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';

var CustomTextBox = (props) => {
    let {value, placeHolder, customClass, onChange} = props;

    return(
        <TextBoxComponent placeholder={placeHolder} value={value} className={customClass} onChange={onChange}></TextBoxComponent>
    )
};

export default CustomTextBox;