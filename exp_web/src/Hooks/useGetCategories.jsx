import React, {useState, useEffect} from 'react';

const useGetCategories = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [categories, setCategories] = useState([]);

    const getCategories =  () => {
        setLoadingState(true);

        try{
            const res = fetch(
                `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Categories`,
                {
                    method: 'GET'
                    // headers: {'Content-Type': "application/json"},
                    // credentials: 'include',
                    // mode: 'cors'
                }
            ).then(res => res.json())
            .then(data => setCategories(data));

            setLoadingState(false);
        }
        catch(error){
            console.log("Failed fetching categories");
            console.log(error);
            setLoadingState(false);
        }
    };

    useEffect(() => { getCategories() }, []);

    return {categories, loadingState, };
};

export default useGetCategories;