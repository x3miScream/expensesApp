import React from 'react';
import {TextBoxComponent} from '@syncfusion/ej2-react-inputs';

var CustomTextBox = (props) => {
    let {value, placeHolder, customClass} = props;

    return(
        <TextBoxComponent placeholder={placeHolder} Value={value} className={customClass}></TextBoxComponent>
    )
};

export default CustomTextBox;