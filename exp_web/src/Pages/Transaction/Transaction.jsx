import React from 'react'
import {useParams} from 'react-router-dom';
import TransactionDetails from '../../Components/TransactionDetails/TransactionDetails.jsx';
import './Transaction.css';

const Transaction = () => {
    const {transactionId, categoryId} = useParams();

    return(
        <div className='category-page-container'>
            <TransactionDetails transactionId={transactionId} categoryId={categoryId}></TransactionDetails>
        </div>
    );
};

export default Transaction;