import {AuthService} from '../Utils/AuthUtils.jsx';

const useCategoryCRUD = () => {
    const getCategories = async (setData) => {
        const authToken = await AuthService.getTokenAsync();
        const url = `${process.env.EXPO_PUBLIC_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/categories`;
        const verb = 'GET';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`},
            credentials: 'include',
            mode: 'cors'
        };

        const res = await fetch(url, fetchObj);
        const data = await res.json();

        setData(data);
    };

    return {
        getCategories
    }
};

export default useCategoryCRUD;