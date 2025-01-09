import React, { Fragment } from 'react';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

const CustomDatePicker = (props) => {
    const {id, placeholder, value, onChange} = props;

    return(<Fragment>
        <DatePickerComponent id={id} placeholder={placeholder} value={value} onChange={onChange} />
    </Fragment>)
};

export default CustomDatePicker;