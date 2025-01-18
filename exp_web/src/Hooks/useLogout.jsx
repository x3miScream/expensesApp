import React, {useState} from 'react';

const useLogout = () => {
    const [loadingState, setLoadingState] = useState(false);
    const logout = async () => {
        setLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Auth`;
        const fetchObject = {
            method: 'DELETE',
            // headers: {'Content-Type': "application/json"},
            credentials: 'include',
            mode: 'cors'
        };

        try{
            const res = await fetch(url, fetchObject);
            const data = await res.json();
        }
        catch(error){
            console.log(`Failed to logout: ${error}`);
            setLoadingState(false);
        }
    };

    return {loadingState, logout};
};

export default useLogout;