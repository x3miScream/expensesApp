import React, {useState} from 'react';

const useSaveTransaction = () => {
    const [loadingState, setLoadingState] = useState(false);

    const saveTransaction = async (props) => {
        setLoadingState(true);
        const {transactionId,
            categoryId,
            transactionDate,
            amount,
            note
        } = props;

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions`;

        const fetchObject = {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            // credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({
                transactionId,
                categoryId,
                transactionDate,
                amount,
                note
            })
        };

        try{
            const res = await fetch(url, fetchObject);

            console.log(res);

            const data = await res.json();

            console.log(data);

            if(data.error){
                throw new Error(data.error);
            }
        }
        catch(error)
        {
            console.log(error);
        }

        setLoadingState(false);
    };

    return {loadingState, saveTransaction};
};

export default useSaveTransaction;