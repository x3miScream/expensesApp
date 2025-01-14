import React, {createContext, useState, useContext} from 'react';

const AuthContext = createContext();

const useAuthContext = () => {
    return useContext(AuthContext);
};

const getAuthUser = async () => {
    
};

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState({});

    return(<AuthContext.Provider value={{authUser, setAuthUser}}>
        {children}
    </AuthContext.Provider>);
};

export default {
    AuthContext,
    useAuthContext,
    AuthContextProvider
};