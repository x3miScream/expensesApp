import Config from '../Configs/Config.js';
import {AuthService} from '../Utils/AuthUtils.jsx';

const useGetMonthlyBudget = () => {
    const getMonthlyBudgetDetails = async (setData) => {
        const authToken = await AuthService.getTokenAsync();
        const url = `${Config.serverApiUrl}/api/budgets/getCurrentPeriodBudget/DEFAULT`;
        const verb = 'GET';

        const fetchObj = {
            method: verb,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            credentials: 'include',
            mode: 'cors'
        };

        try{
            const res = await fetch(url, fetchObj);
            const data = await res.json();
            setData(data);
        }
        catch(error)
        {
            console.log(error);
        }
    };


    const getMonthlyBudgetSummary = async (setData) => {
        const url = `${Config.serverApiUrl}/api/budgets/getCurrentPeriodBudgetSummary/DEFAULT`;
        const verb = 'GET';
        const authToken = await AuthService.getTokenAsync();

        const fetchObj = {
            method: verb,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            credentials: 'include',
            mode: 'cors'
        };

        const res = await fetch(url, fetchObj);
        const data = await res.json();
        setData(data);
    };


    return {
        getMonthlyBudgetDetails,
        getMonthlyBudgetSummary
    }
};

export default useGetMonthlyBudget;