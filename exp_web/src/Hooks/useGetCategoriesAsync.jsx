import React, {useState, useEffect} from 'react';

const useGetCategoriesAsync = async (props) => {
    const {refreshDatasourceCallback} = props;
    const [loadingState, setLoadingState] = useState(false);
    const [categories, setCategories] = useState([]);

    const getCategoriesAsync = async () => {
        setLoadingState(true);

        try{
            const res = await fetch(
                `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Categories`,
                {
                    method: 'GET'
                    // headers: {'Content-Type': "application/json"},
                    // credentials: 'include',
                    // mode: 'cors'
                }
            )

            const data = await res.json();
    
            if(data.error){
                throw new Error(data.error);
            }
            console.log(data)
            setCategories(data);
            setLoadingState(false);
            refreshDatasourceCallback();
        }
        catch(error){
            console.log("Failed fetching categories");
            console.log(error);
            setLoadingState(false);
        }
    };

    useEffect(() => { getCategoriesAsync() }, []);

    return {categories, loadingState, };
};

export default useGetCategoriesAsync;