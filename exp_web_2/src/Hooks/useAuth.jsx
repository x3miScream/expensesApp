import React from 'react';

const useAuth = () => {
    const login = async (loginObject, ) => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/auth/login`;
        const verb = 'POST';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(loginObject)
        };

        const res = await fetch(url, fetchObj);
        const data = await res.json();
    };

    const logout = async () => {
        
    };
};

export default useAuth;