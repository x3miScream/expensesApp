import React, {useState} from 'react';
import useGetCategories from '../../Hooks/useGetCategories';
import CategorySelectionCard from '../CategorySelectionCard/CategorySelectionCard.jsx';
import  { useNavigate } from 'react-router-dom';
import {DialogComponent} from '@syncfusion/ej2-react-popups';
import TransactionDetails from '../TransactionDetails/TransactionDetails';

import './CategorySelection.css';

const CategorySelection = (props) => {
    const {closePopupCallBack} = props;
    const {categories, loadingState} = useGetCategories();
    const [isShowTransactionPopup, setIsShowTransactionPopup] = useState(false);
    const navigate = useNavigate();

    const onClickCategorySelectionCard = async (categoryId) => {
        closePopupCallBack();
        navigate(`/transaction/${0}/${categoryId}`);
    };

    const closeTransactionPopup = async () => {
        setIsShowTransactionPopup(false);
    };

    return(<div className='category-selection-page'>
        <div className='category-selection-cards-container'>
            {loadingState ? '' : 
                categories.map((item, index) => {
                    return <CategorySelectionCard key={item.categoryId} category={item} onClick={() => {onClickCategorySelectionCard(item.categoryId)}}></CategorySelectionCard>;
                })
            }

            {/* <DialogComponent target={'.App'} width='90rem' minHeight='80%' isModal={true} visible={isShowTransactionPopup} showCloseIcon={true} close={closeTransactionPopup}>
                <TransactionDetails transactionId={0} categoryId={category.categoryId} isPopup={true}></TransactionDetails>
            </DialogComponent> */}
        </div>
    </div>);
};

export default CategorySelection;