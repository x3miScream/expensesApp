import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import  { Navigate, Link, useNavigate } from 'react-router-dom';
import CustomDatePicker from '../../Components/UIControls/CustomDatePicker.jsx';
import CustomButton from '../../Components/UIControls/CustomButton.jsx';
import CustomTextBox from '../../Components/UIControls/CustomTextBox.jsx';
import useSaveTransaction from '../../Hooks/useSaveTransaction.jsx';

import './Transaction.css';

const TransactionDetails = () => {
    const {transactionId} = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState({});
    const {loadingState, saveTransaction} = useSaveTransaction();
        
    const onRedirectToTransactionsClick = () => {
        navigate(`/transactions`);
    }


    const onSaveTransactionClick = async () => {
        await saveTransaction({...transaction, method: 'update'});
    }

    const onDeleteTransactionClick = async () => {
        
    }

    const getTransactionDetails = async () => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions/${transactionId}`;
        const fetchObject = { method: 'GET' };

        try{
            const res = fetch(url, fetchObject)
            .then(res => res.json())
            .then(data => {
                setTransaction(data);
            });
        }
        catch(error){
            console.log(`Failed to fetch transaction with id: ${transactionId} - with error: ${error}`);
        }
    };

    useEffect(() => {getTransactionDetails()}, []);

    return(<div>
        <div className='transaction-details-container'>
            <label>Transaction Id</label>
            <CustomTextBox value={transaction.transactionId}></CustomTextBox>

            <label>Category Id</label>
            <CustomTextBox value={transaction.categoryId}></CustomTextBox>

            <label>Category Type</label>
            <CustomTextBox value={transaction.categoryType}></CustomTextBox>

            <label>Category</label>
            <CustomTextBox value={transaction.categoryName}
                onChange={(e) => setTransaction({...transaction, categoryName: e.target.value})}
            ></CustomTextBox>

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