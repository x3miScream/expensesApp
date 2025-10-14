import React, {useState} from 'react';

const useTransactionCreateUdpateDelete = () => {
    const [saveLoadingState, setSaveLoadingState] = useState(false);

    const saveTransaction = async (transaction) => {
        setSaveLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/transactions`;
        const verb = 'POST';
console.log(url)
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

            console.log(res);
            console.log(data);
        }
        catch(error){
            console.log(error)
        }
        finally{
            setSaveLoadingState(false);
        }
    }
    
    return {
        saveLoadingState,
        saveTransaction
    }
}

export default useTransactionCreateUdpateDelete;