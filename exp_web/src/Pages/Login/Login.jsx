import React, { useState, useEffect } from 'react';
import useLogin from '../../Hooks/useLogin.jsx';
import './Login.css';
import CustomButton from '../../Components/UIControls/CustomButton.jsx';
import CustomTextBox from '../../Components/UIControls/CustomTextBox.jsx';

const Login = () => {
    const [inputs, setInputs] = useState({
        // userLoginId: 'atai',
        userLoginId: '',
        password: ''
    });

    const {loadingState, login} = useLogin();

    const loginAction = async (e) => {
        e.preventDefault();
        var loginResult = await login(inputs);
    };

    return (<div className='login-page-div'>
        <form onSubmit={loginAction}>
            <label>Username</label>
            <CustomTextBox value={inputs.userLoginId} placeHolder='Username' onChange={(e) => setInputs({...inputs, userLoginId: e.target.value})}></CustomTextBox>

            <label>Password</label>
            <CustomTextBox value={inputs.password} placeHolder='Password' type='password' onChange={(e) => setInputs({...inputs, password: e.target.value})}></CustomTextBox>

            <CustomButton type='submit' text="Login"></CustomButton>
        </form>
    </div>);
};

export default Login;