import React, {useState, useEffect} from 'react';

const useGetTransactions = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const getTransactions = () => {
        setLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Transactions`;
        const fetchObject = 
        {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        };

        try{
            const res = fetch(url, fetchObject)
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoadingState(false);
            });
        }
        catch(error){
            console.log(`Failed to fetch transactions with error: ${error}`);
            setLoadingState(false);
        }
    };

    useEffect(() => { getTransactions() }, []);

    return {transactions, loadingState};
};

export default useGetTransactions;