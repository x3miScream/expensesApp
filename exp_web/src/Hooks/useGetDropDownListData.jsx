import React, {useState} from 'react';

const useGetDropDownListData = () => {
    const [ddlLoadingState, setDdlLoadingState] = useState(false);
    const [dropDownListData, setDropDownListData] = useState([]);

    const ddlTypeMap = [
        {"category": "Category"}
    ]

    const getDropDownList = async (dropDownListType, setDropDownListCallBack) => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/DropDownLists/${dropDownListType}`;
        const fetchObject = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };

        try{
            const res = await fetch(url, fetchObject);
            const data = await res.json();
            console.log('DDL');
            console.log(data);
            setDropDownListData(data);
            setDropDownListCallBack(data);
            setDdlLoadingState(true);
        }
        catch(error){
            console.log(`Failed to logout: ${error}`);
            setDdlLoadingState(false);
        }
    };

    return {ddlLoadingState, getDropDownList};
};

export default useGetDropDownListData;