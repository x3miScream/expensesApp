import React from 'react';

const useAuth = () => {
    const login = (loginObject) => {
        const loginPromise = new Promise(async (resolve, reject) => {
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
            if(res.status === 400)
            {
                reject(res);
            }
            else{
                const data = await res.json();
                resolve({res, data});
            }
        });

        return loginPromise;
    };

    const logout = async (postLogoutAction) => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/auth/logout`;
        const verb = 'DELETE';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors',
        };

        const res = await fetch(url, fetchObj);
        const data = await res.json();

        if(postLogoutAction !== undefined)
        {
            postLogoutAction();
        }
    };

    return {
        login,
        logout
    }
};

export default useAuth;