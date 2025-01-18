import React, { useState, useEffect } from 'react';
import useLogin from '../../Hooks/useLogin.jsx';
import './Login.css';

const Login = () => {
    const [inputs, setInputs] = useState({
        // userLoginId: 'atai',
        userLoginId: 'hans',
        password: 'password'
    });

    const {loadingState, login} = useLogin();

    useEffect(() => { login(inputs) }, []);

    return (<div>
        Hi From Login
    </div>);
};

export default Login;