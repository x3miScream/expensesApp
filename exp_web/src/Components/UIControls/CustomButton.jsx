import React, { Fragment } from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

const CustomButton = (props) => {
    const {text, onClick, type} = props;

    return (<Fragment>
        <ButtonComponent onClick={onClick} type={type}>{text}</ButtonComponent>
    </Fragment>);
};

export default CustomButton;