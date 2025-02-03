import React, {useState} from 'react';

const useGetCategoryDetails = () => {
    const [getCategoryDetailsLoadingState, setGetCategoryDetailsLoadingState] = useState(true);

    const getCategoryDetails = async (categoryId, setCategoryDataCallback) => {
        setGetCategoryDetailsLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Categories/${categoryId}`;
        const fetchObject = 
        {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
        };

        try{
            const res = await fetch(url, fetchObject);
            const data = await res.json();
            console.log(data);
            setCategoryDataCallback(data);
            setGetCategoryDetailsLoadingState(false);
        }
        catch(error){
            console.log(`Failed to fetch transactions with error: ${error}`);
            setGetCategoryDetailsLoadingState(false);
        }
    };

    return {getCategoryDetailsLoadingState, getCategoryDetails};
};

export default useGetCategoryDetails;