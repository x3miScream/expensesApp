import React, {useState} from 'react';

const useLogin = () => {
    const [loadingState, setLoadingState] = useState(false);

    const login = async ({userLoginId, password}) => {
        const success = handleInputErrors({userLoginId, password});
        
        if(!success) return;

        setLoadingState(true);

        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Auth`;
        const fetchObject = {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({userLoginId, password})
        };

        try{
            const res = await fetch(url, fetchObject);

            // console.log(res);

            const data = await res.json();

            // console.log(data);
        }
        catch(error){
            console.log(`Failed to fetch auth login with error: ${error}`);
            setLoadingState(false);
        }
    };

    const handleInputErrors = ({userLoginId, password}) => {
        if(!userLoginId || !password){
            console.log("Please fill in all fields.");
            // toast.error("Please fill in all fields.");
            return false;
        }

        return true;
    };

    return {loadingState, login};
};

export default useLogin;