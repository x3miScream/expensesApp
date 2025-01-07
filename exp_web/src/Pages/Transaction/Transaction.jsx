import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import  { Navigate, Link, useNavigate } from 'react-router-dom';

import './Transaction.css';

import CustomButton from '../../Components/UIControls/CustomButton.jsx';
import CustomTextBox from '../../Components/UIControls/CustomTextBox.jsx';

const TransactionDetails = () => {
    const {transactionId} = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState({});
        
    const onRedirectToTransactionsClick = () => {
        navigate(`/transactions`);
    }

    const getTransactionDetails = async () => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions/${transactionId}`;
        const fetchObject = { method: 'GET' };

        try{
            const res = fetch(url, fetchObject)
            .then(res => res.json())
            .then(data => {
                setTransaction(data);
                console.log(data);
                console.log(transaction);
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

            <label>Category Type</label>
            <CustomTextBox value={transaction.categoryType}></CustomTextBox>

            <label>Category</label>
            <CustomTextBox value={transaction.categoryName}></CustomTextBox>

            <label>Transaction Date</label>
            <CustomTextBox value={transaction.transactionDate}></CustomTextBox>
            
            <label>Amount</label>
            <CustomTextBox value={transaction.amount}></CustomTextBox>

            <label>Note</label>
            <CustomTextBox value={transaction.note}></CustomTextBox>
        </div>

        <div className='transaction-details-buttons-container'>
            <CustomButton text="Save" onClick={onRedirectToTransactionsClick}></CustomButton>
            <CustomButton text="Back" onClick={onRedirectToTransactionsClick}></CustomButton>
        </div>
    </div>);
};

export default TransactionDetails;