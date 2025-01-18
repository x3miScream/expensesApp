import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Categories from '../../Pages/Categories/Categories.jsx';
import Transactions from '../../Pages/Transactions/Transactions.jsx';
import Transaction from '../../Pages/Transaction/Transaction.jsx';
import Navbar from '../NavBar/NavBar.jsx';
import Login from '../../Pages/Login/Login.jsx';
import './ExpensesApp.css';
import {useAuthContext} from '../../Contexts/AuthContext.jsx';
import Category from '../../Pages/Category/Category.jsx';

const ExpensesApp = () => {
    const {authUser, ready} = useAuthContext();

    return(<div className='expenses-app-container'>
      {ready ? `Hi ${authUser.userName}` : 'Hi Gues'}
        <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path='/' element={<Categories />}></Route>
          <Route path='/login' element={<Login />}></Route>
          
          <Route path='/categories' element={<Categories />}></Route>
          <Route path='/category' element={<Category />}>
            <Route path=':categoryId' element={<Category />}></Route>
          </Route>

          <Route path='/transactions' element={<Transactions />}></Route>
          <Route path='/transaction' element={<Transaction />}>
            <Route path=':transactionId' element={<Transaction />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>);
};

export default ExpensesApp;