import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import  { Navigate, Link, useNavigate } from 'react-router-dom';
import CustomDatePicker from '../../Components/UIControls/CustomDatePicker.jsx';
import CustomButton from '../../Components/UIControls/CustomButton.jsx';
import CustomTextBox from '../../Components/UIControls/CustomTextBox.jsx';
import useSaveTransaction from '../../Hooks/useSaveTransaction.jsx';
import useGetDropDownListData from '../../Hooks/useGetDropDownListData.jsx';

import './Transaction.css';
import CustomDropDown from '../../Components/UIControls/CustomDropDown.jsx';

const TransactionDetails = () => {
    const {transactionId} = useParams();
    const [categoriesDDLDataSource, setCategoriesDDLDataSource] = useState([]);
    const [subCategoriesDDLDataSource, setSubCategoriesDDLDataSource] = useState([]);
    const categoryDropdownListFields = { text: 'value', value: 'key' };
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState({});
    const {loadingState, createTransaction, updateTransaction} = useSaveTransaction();
    const {ddlLoadingState, getDropDownList} = useGetDropDownListData();
        
    const onRedirectToTransactionsClick = () => {
        navigate(`/transactions`);
    }


    const onSaveTransactionClick = async () => {
        await updateTransaction(transaction);
    }

    const onDeleteTransactionClick = async () => {
        
    }

    const getTransactionDetails = async (callbackFnc) => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions/${transactionId}`;
        const fetchObject = { method: 'GET', credentials: 'include', mode: 'cors' };

        try{
            const res = fetch(url, fetchObject)
            .then(res => res.json())
            .then(data => {
                setTransaction(data);
                callbackFnc();
            });
        }
        catch(error){
            console.log(`Failed to fetch transaction with id: ${transactionId} - with error: ${error}`);
        }
    };

    const getDropDownListDataSource = async () => {
        await getDropDownList('Category', setCategoriesDDLDataSource);
        await refreshSubCategoryDroDownListDataSource(transaction.categoryId);
    };

    const refreshSubCategoryDroDownListDataSource = async (categoryId) => {
        await getDropDownList('SubCategory', setSubCategoriesDDLDataSource, `parentId=${categoryId}`);
    };

    const initializePage = async () => {
        await getTransactionDetails(getDropDownListDataSource);
    };

    const onCategoryDropDownListChange = (e) => {
        setTransaction({...transaction, categoryId: e.target.value})

        refreshSubCategoryDroDownListDataSource(e.target.value);
    };

    useEffect(() => {initializePage()}, []);

    return(<div>
        <div className='transaction-details-container'>
            <label>Transaction Id</label>
            <CustomTextBox value={transaction.transactionId}></CustomTextBox>

            <label>Category</label>
            {ddlLoadingState ? <CustomDropDown id='categoryDDL' dataSource={categoriesDDLDataSource} fields={categoryDropdownListFields} value={transaction.categoryId}
                onChange={onCategoryDropDownListChange}></CustomDropDown> : ''}

            <label>Sub Category</label>
            {ddlLoadingState ? <CustomDropDown id='subCategoryDDL' dataSource={subCategoriesDDLDataSource} fields={categoryDropdownListFields} value={transaction.subCategoryId}
                onChange={(e) => {setTransaction({...transaction, subCategoryId: e.target.value})}}></CustomDropDown> : ''}

            <label>Category Type</label>
            <CustomTextBox value={transaction.categoryType}></CustomTextBox>

            <label>Transaction Date</label>
            <CustomDatePicker id="TransactionDate" placeholder="Enter Transaction Date" value={transaction.transactionDate}
                onChange={(e) => setTransaction({...transaction, transactionDate: e.target.value})}
            ></CustomDatePicker>
            
            <label>Amount</label>
            <CustomTextBox value={transaction.amount}
                onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
            ></CustomTextBox>

            <label>Note</label>
            <CustomTextBox value={transaction.note}
                onChange={(e) => setTransaction({...transaction, note: e.target.value})}
            ></CustomTextBox>
        </div>

        <div className='transaction-details-buttons-container'>
            <CustomButton text="Save" onClick={onSaveTransactionClick}></CustomButton>
            <CustomButton text="Delete" onClick={onDeleteTransactionClick}></CustomButton>
            <CustomButton text="Back" onClick={onRedirectToTransactionsClick}></CustomButton>
        </div>
    </div>);
};

export default TransactionDetails;