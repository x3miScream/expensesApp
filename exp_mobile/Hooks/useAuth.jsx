import Config from '../Configs/Config.js';
import {AuthService} from '../Utils/AuthUtils.jsx';

const useAuth = () => {
    const getCurrentUserAsync = async() => {
        return await AuthService.getUserNameAsync();
    };

    const login = (loginObject) => {
        const loginPromise = new Promise(async (resolve, reject) => {
            const url = `${Config.serverApiUrl}/api/auth/login`;
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
                await AuthService.saveTokenAsync(data.token);
                resolve({res, data});
            }
        });

        return loginPromise;
    };

    const logout = async (postLogoutAction) => {
        const url = `${Config.serverApiUrl}/api/auth/logout`;
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
        logout,
        getCurrentUserAsync
    }
};

export default useAuth;