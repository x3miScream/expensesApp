import React, {useState} from 'react';

const useTransactionCreateUdpateDelete = () => {
    const [saveLoadingState, setSaveLoadingState] = useState(false);

    const getTransactions = async (setData) => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/transactions`;
        const verb = 'GET';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors'
        };

        const res = await fetch(url, fetchObj);
        const data = await res.json();

        setData(data);
    };

    const createTransaction = async(transaction) => {
        await saveTransaction(transaction, 'create');
    };
    const updateTransaction = async(transaction) => {
        await saveTransaction(transaction, 'update');
    };

    const saveTransaction = async (transaction, actino) => {
        setSaveLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/transactions`;
        let verb = 'POST';

        if(actino === 'update')
            verb = 'PUT';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(transaction)
        }

        try{
            const res = await fetch(url, fetchObj);
            const data = await res.json();
        }
        catch(error){
            console.log(error)
        }
        finally{
            setSaveLoadingState(false);
        }
    }

    const deleteTransaction = async (id) => {
        setSaveLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/transactions?id=${id}`;
        const verb = 'DELETE';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors'
        }

        try{
            const res = await fetch(url, fetchObj);
            const data = await res.json();
        }
        catch(error){
            console.log(error)
        }
        finally{
            setSaveLoadingState(false);
        }
    };

    
    return {
        saveLoadingState,
        createTransaction,
        updateTransaction,
        getTransactions,
        deleteTransaction
    }
}

export default useTransactionCreateUdpateDelete;