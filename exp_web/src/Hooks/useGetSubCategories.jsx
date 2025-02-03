import React, {useState} from 'react';

const useGetSubCategories = () => {
    const [getSubCategoriesLoadingState, setGetSubCategoriesLoadingState] = useState(true);
    const [subCategories, setSubCategories] = useState([]);

    const getSubCategories = async (categoryId, setSubCategoriesDataCallBack) => {
        setGetSubCategoriesLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Categories/${categoryId}/SubCategories`;
        const fetchObject = {
            method: 'GET',
            headers: {'Content-Type': "application/json"},
            credentials: 'include',
            mode: 'cors'
        };

        try{
            const res = await fetch(url, fetchObject);
            const data = await res.json();

            setSubCategories(data);
            setSubCategoriesDataCallBack(data);

            setGetSubCategoriesLoadingState(false);

            return data;
        }
        catch(error){
            console.log(`Failed to fetch auth login with error: ${error}`);
            setGetSubCategoriesLoadingState(false);
            return [];
        }
    };

    return {getSubCategoriesLoadingState, getSubCategories};
};

export default useGetSubCategories;