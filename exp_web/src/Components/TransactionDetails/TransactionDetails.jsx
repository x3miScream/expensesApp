import React, {useState, useEffect, Confirm, Fragment} from 'react'
import {useParams} from 'react-router-dom';
import  { Navigate, Link, useNavigate } from 'react-router-dom';
import CustomDatePicker from '../UIControls/CustomDatePicker.jsx';
import CustomButton from '../UIControls/CustomButton.jsx';
import CustomTextBox from '../UIControls/CustomTextBox.jsx';
import CustomLabel from '../UIControls/CustomLabel.jsx';
import useSaveTransaction from '../../Hooks/useSaveTransaction.jsx';
import useGetDropDownListData from '../../Hooks/useGetDropDownListData.jsx';
import CustomDropDown from '../UIControls/CustomDropDown.jsx';

import './TransactionDetails.css';

const TransactionDetails = (props) => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const {transactionId, categoryId} = props;
    const [isCategoryDisabled, setIsCategoryDisabled] = useState((transactionId == 0 && categoryId != undefined));
    const [categoriesDDLDataSource, setCategoriesDDLDataSource] = useState([]);
    const [subCategoriesDDLDataSource, setSubCategoriesDDLDataSource] = useState([]);
    const navigate = useNavigate();
    let [transaction, setTransaction] = useState({
        transactionId: transactionId,
        categoryId: (categoryId != undefined ? parseInt(categoryId) : 0) ,
        transactionDate: new Date()
    });
    const {loadingState, createTransaction, updateTransaction, deleteTransaction} = useSaveTransaction();
    const {ddlLoadingState, getDropDownList} = useGetDropDownListData();
        
    const onRedirectToTransactionsClick = () => {
        navigate(`/transactions`);
    }

    const onSaveTransactionClick = async () => {
        if(transaction.transactionId == 0)
            await createTransaction({...transaction, callBack: onRedirectToTransactionsClick});
        else
            await updateTransaction({...transaction, callBack: onRedirectToTransactionsClick});
    }

    const onDeleteTransactionClick = async () => {
        await deleteTransactionAction();
    }

    const deleteTransactionAction = async () => {
        await deleteTransaction(transaction.transactionId, onRedirectToTransactionsClick);
    }

    const getTransactionDetails = async (callbackFnc) => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions/${transactionId}`;
        const fetchObject = { method: 'GET', credentials: 'include', mode: 'cors' };

        try{
            const res = fetch(url, fetchObject)
            .then(res => res.json())
            .then(data => {
                setTransaction(data);
                transaction = data;
                
                callbackFnc();

                setIsPageLoaded(true);
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
        if(transaction.transactionId != 0)
            await getTransactionDetails(getDropDownListDataSource);
        else{
            setIsPageLoaded(true);
            await getDropDownListDataSource();
        }
    };

    const onCategoryDropDownListChange = (e) => {
        setTransaction({...transaction, categoryId: e.target.value})

        console.log(transaction);

        refreshSubCategoryDroDownListDataSource(e.target.value);
    };

    useEffect(() => {initializePage()}, []);

    return(<div>
        {!isPageLoaded ? 'Loading...' : <Fragment>
            <div className='transaction-details-container'>
                <CustomLabel>Category</CustomLabel>
                <CustomDropDown id='categoryDDL' dataSource={categoriesDDLDataSource} value={transaction.categoryId}
                    enabled={!isCategoryDisabled}
                    onChange={onCategoryDropDownListChange}></CustomDropDown>

                <CustomLabel>Sub Category</CustomLabel>
                <CustomDropDown id='subCategoryDDL' dataSource={subCategoriesDDLDataSource} value={transaction.subCategoryId}
                    onChange={(e) => {setTransaction({...transaction, subCategoryId: e.target.value})}}></CustomDropDown>

                <CustomLabel>Transaction Date</CustomLabel>
                <CustomDatePicker id="TransactionDate" placeholder="Enter Transaction Date" value={transaction.transactionDate} format='dd MMM yyyy'
                    onChange={(e) => setTransaction({...transaction, transactionDate: e.target.value})}
                ></CustomDatePicker>
                
                <CustomLabel>Amount</CustomLabel>
                <CustomTextBox value={transaction.amount}
                    onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
                ></CustomTextBox>

                <CustomLabel>Note</CustomLabel>
                <CustomTextBox value={transaction.note}
                    onChange={(e) => setTransaction({...transaction, note: e.target.value})}
                ></CustomTextBox>
            </div>

            <div className='transaction-details-buttons-container'>
                <CustomButton text="Save" onClick={onSaveTransactionClick}></CustomButton>
                {transaction.transactionId == 0 ? '' : <CustomButton text="Delete" onClick={onDeleteTransactionClick}></CustomButton>}
                <CustomButton text="Back" onClick={onRedirectToTransactionsClick}></CustomButton>
            </div>
        </Fragment>
        }
    </div>);
};

export default TransactionDetails;