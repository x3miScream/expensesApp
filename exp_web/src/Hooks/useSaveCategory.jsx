import React, {useState} from 'react';

const useSaveCategory = () => {

    const [saveCategoryLoadingState, setSaveCategoryLoadingState] = useState(false);

    const createCategory = async (props) => {
        saveCategory({...props, method: 'create'});
    };

    const updateCategory = async (props) => {
        saveCategory({...props, method: 'update'});
    };

    const deleteCategory = async () => {

    };

    const saveCategory = async (props) => {
        setSaveCategoryLoadingState(true);

        const {categoryId,
            categoryCode,
            categoryName,
            categoryType,
            method,
            callBack
        } = props;

        let url = '';
        let verb = '';

        switch(method)
        {
            case "create":
                url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Categories`;
                verb = 'POST';
                break;
            case "update": 
                url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Categories/${categoryId}`;
                verb = 'PUT';
                break;
            default:
                url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Categories`;
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
                categoryId,
                categoryCode,
                categoryName,
                categoryType
            })
        };

        try{
            const res = await fetch(url, fetchObject);

            const data = await res.json();

            if(data.error){
                throw new Error(data.error);
            }

            callBack();
            setSaveCategoryLoadingState(false);
        }
        catch(error)
        {
            console.log(error);
            setSaveCategoryLoadingState(false);
        }
    };

    return {saveCategoryLoadingState, createCategory, updateCategory, deleteCategory, saveCategory};
};

export default useSaveCategory;