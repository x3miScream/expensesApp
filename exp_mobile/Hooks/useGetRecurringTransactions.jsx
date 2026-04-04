import {AuthService} from '../Utils/AuthUtils.jsx';

const useGetRecurringTransactions = () => {
    const getRecurringTransactiosn = async (setData) => {
        const authToken = await AuthService.getTokenAsync();
        const url = `${process.env.EXPO_PUBLIC_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/recurringTransactions`;
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
        getRecurringTransactiosn
    };
};

export default useGetRecurringTransactions;