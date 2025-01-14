import React from 'react';

const useLogin = () => {
    const [loadingState, setLoadingState] = useState(false);

    const login = async (userName, password) => {
        
    };

    return {loadingState, login};
};

export default useLogin;