import React from 'react';
import './CustomLabel.css';

const CustomLabel = (props) => {
    const {children} = props;

    return(
        <label className='custom-label'>{children}</label>
    );
};

export default CustomLabel;