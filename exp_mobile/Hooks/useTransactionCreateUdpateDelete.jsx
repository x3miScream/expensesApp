import {useState} from 'react';
import {AuthService} from '../Utils/AuthUtils.jsx';

const useTransactionCreateUdpateDelete = () => {
    const [saveLoadingState, setSaveLoadingState] = useState(false);

    const getTransactions = async (setData) => {
        const authToken = await AuthService.getTokenAsync();
        const url = `${process.env.EXPO_PUBLIC_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/transactions`;
        const verb = 'GET';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`},
            credentials: 'include',
            mode: 'cors'
        };

        const res = await fetch(url, fetchObj);
        const data = await res.json();

        setData(data);
    };

    const createTransaction = async(transaction, postSaveCallback) => {
        await saveTransaction(transaction, 'create', postSaveCallback);
    };
    const updateTransaction = async(transaction, postSaveCallback) => {
        await saveTransaction(transaction, 'update', postSaveCallback);
    };

    const saveTransaction = async (transaction, action, postSaveCallback) => {
        setSaveLoadingState(true);
        const authToken = await AuthService.getTokenAsync();
        const url = `${process.env.EXPO_PUBLIC_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/transactions`;
        let verb = 'POST';

        if(action === 'update')
            verb = 'PUT';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(transaction)
        }

        try{
            const res = await fetch(url, fetchObj);

            if(postSaveCallback !== undefined)
                postSaveCallback();
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
        const authToken = await AuthService.getTokenAsync();
        const url = `${process.env.EXPO_PUBLIC_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/transactions?id=${id}`;
        const verb = 'DELETE';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`},
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