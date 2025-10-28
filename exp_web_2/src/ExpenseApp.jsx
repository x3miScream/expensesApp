import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuthContext} from './Context/AuthContext.jsx';
import Home from './Features/Home/Home.jsx';
import LoginScreen from './Components/Auth/LoginScreen.jsx';

const ExpenseApp = () => {
    const {authUser, ready} = useAuthContext();

    console.log(authUser)

    return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home></Home>}></Route> */}
          <Route path="/" element={(authUser ? <Home></Home> : <Navigate to='/login'></Navigate>)}></Route>
          <Route path='/login' element={(authUser ? <Navigate to='/'></Navigate> : <LoginScreen />)}></Route>
        </Routes>
        </BrowserRouter>
    </div>
  );
};

export default ExpenseApp;