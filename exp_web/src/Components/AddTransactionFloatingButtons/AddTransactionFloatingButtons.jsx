import React, {useState} from 'react';
import CustomButton from '../UIControls/CustomButton.jsx';
import {DialogComponent} from '@syncfusion/ej2-react-popups';
import CategorySelection from '../CategorySelection/CategorySelection.jsx';

import './AddTransactionFloatingButtons.css';

const AddTransactionFloatingButtons = () => {
    const [isShowCategoriesPopup, setIsShowCategoriesPopup] = useState(false);

    const addIncomeTransaction = async () => {
        setIsShowCategoriesPopup(true);
    };

    const addExpenseTransaction = async () => {
        setIsShowCategoriesPopup(true);
    };

    const closeCategoriesPopup = async () => {
        setIsShowCategoriesPopup(false);
    };

    return(<div className='add-transaction-floating-button-container' id='dialog-target'>
        <CustomButton onClick={addIncomeTransaction} className='add-transaction-floating-button' text='+'></CustomButton>
        <CustomButton onClick={addExpenseTransaction} className='add-transaction-floating-button' text='-'></CustomButton>

        <DialogComponent target={'.App'} width='100rem' minHeight='90%' isModal={true} visible={isShowCategoriesPopup} showCloseIcon={true} close={closeCategoriesPopup}> 
            <CategorySelection closePopupCallBack={closeCategoriesPopup}></CategorySelection> 
        </DialogComponent>
      </div>);
};

export default AddTransactionFloatingButtons;