import React, {useState} from 'react';

const useGetDropDownListData = () => {
    const [ddlLoadingState, setDdlLoadingState] = useState(true);
    const [dropDownListData, setDropDownListData] = useState([]);

    const ddlTypeMap = [
        {"category": "Category"}
    ]

    const getDropDownList = async (dropDownListType, setDropDownListCallBack, customParam) => {
        setDdlLoadingState(true);
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/DropDownLists/${dropDownListType}${(customParam ? `?${customParam}` : ``)}`;

        const fetchObject = {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        };

        try{
            const res = await fetch(url, fetchObject);
            const data = await res.json();
            setDropDownListData(data);
            setDropDownListCallBack(data);
            setDdlLoadingState(false);
        }
        catch(error){
            console.log(`Failed to logout: ${error}`);
            setDdlLoadingState(false);
        }
    };

    return {ddlLoadingState, getDropDownList};
};

export default useGetDropDownListData;