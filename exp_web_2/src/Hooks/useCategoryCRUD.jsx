import React from 'react';

const useCategoryCRUD = () => {
    const getCategories = async (setData) => {
        const url = `${process.env.REACT_APP_EXPENSE_TRACK_APP_SERVER_HOST_URL}/api/categories`;
        const verb = 'GET';

        const fetchObj = {
            method: verb,
            headers: {'Content-Type': 'application/json'},
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