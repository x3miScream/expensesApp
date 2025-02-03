import React, {useState} from 'react';
import {toast} from 'react-hot-toast';


const useSaveTransaction = () => {
    const [loadingState, setLoadingState] = useState(false);

    const createTransaction = async (props) => {
        await saveTransaction({...props, method: 'create'});
    };

    const updateTransaction = async (props) => {
        await saveTransaction({...props, method: 'update'});
    };

    const deleteTransaction = async (transactionId, callBack) => {
        setLoadingState(true);
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions/${transactionId}`;
        const verb = 'DELETE';

        const fetchObject = {
            method: verb,
            headers: {'Content-Type': "application/json"},
            credentials: 'include',
            mode: 'cors'
        };

        try{
            const res = await fetch(url, fetchObject);
            setLoadingState(false);
            callBack();
        }
        catch(error)
        {
            console.log(error);
        }

        setLoadingState(false);
    };

    const saveTransaction = async (props) => {
        setLoadingState(true);
        const {transactionId,
            categoryId,
            subCategoryId,
            transactionDate,
            amount,
            note,
            callBack,
            method
        } = props;

        let url = '';
        let verb = '';

        switch(method)
        {
            case "create":
                url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions`;
                verb = 'POST';
                break;
            case "update": 
                url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions/${transactionId}`;
                verb = 'PUT';
                break;
            default:
                url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions`;
                verb = 'POST';
                break;
                break;
        }
         

        const fetchObject = {
            method: verb,
            headers: {'Content-Type': "application/json"},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({
                transactionId,
                categoryId,
                subCategoryId,
                transactionDate,
                amount,
                note
            })
        };

        try{
            const res = await fetch(url, fetchObject);

            const data = await res.json();

            if(data.error){
                throw new Error(data.error);
            }

            callBack();
            setLoadingState(false);
        }
        catch(error)
        {
            console.log(error);
            setLoadingState(false);
        }
    };

    return {loadingState, createTransaction, updateTransaction, deleteTransaction};
};

export default useSaveTransaction;