import React, {createContext, useState, useContext, useEffect} from 'react';

const AuthContext = createContext();

const useAuthContext = () => {
    return useContext(AuthContext);
};

const getAuthUser = async (callBackSetUser, callBackSetReady) => {
    const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/Auth/getCurrentAuthUser`;
        const fetchObject = {
            method: 'GET',
            // headers: {'Content-Type': "application/json"},
            credentials: 'include',
            mode: 'cors'
        };

        try{
            let res = await fetch(url, fetchObject);

            if(res.status == 200)
            {
                let data = await res.json();

                callBackSetUser(data);
                callBackSetReady(true);
            }
            else
            {
                callBackSetReady(true);
            }
        }
        catch(error){
            console.log(`Failed to fetch auth login with error: ${error}`);
        }
};

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(undefined);
    const [ready, setReady] = useState(false);


    useEffect(() => {
        if(!authUser)
        {
            getAuthUser(setAuthUser, setReady);
        }
        else
        {
            setReady(true);
        }
    }, []);

    return(<AuthContext.Provider value={{authUser, setAuthUser, ready}}>
        {children}
    </AuthContext.Provider>);
};

export {
    AuthContext,
    useAuthContext,
    AuthContextProvider
};