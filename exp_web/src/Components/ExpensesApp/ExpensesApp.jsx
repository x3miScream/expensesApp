import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Categories from '../../Pages/Categories/Categories.jsx';
import Transactions from '../../Pages/Transactions/Transactions.jsx';
import Transaction from '../../Pages/Transaction/Transaction.jsx';
import Navbar from '../NavBar/NavBar.jsx';
import Login from '../../Pages/Login/Login.jsx';
import './ExpensesApp.css';
import {useAuthContext} from '../../Contexts/AuthContext.jsx';
import Category from '../../Pages/Category/Category.jsx';
import AddTransactionFloatingButtons from '../AddTransactionFloatingButtons/AddTransactionFloatingButtons.jsx';
import {Toaster} from 'react-hot-toast';

const ExpensesApp = () => {
    const {authUser, ready} = useAuthContext();
    return(<div className='expenses-app-container'>
      {(ready && authUser) ? `Hi ${authUser.userName}` : 'Hi Guest'}
        <BrowserRouter>
        {authUser ? <Navbar></Navbar> : ''}
        <Routes>
          <Route path='/' element={ (authUser ? <Categories /> : <Navigate to='/login'></Navigate>) }></Route>
          <Route path='/login' element={(authUser ? <Navigate to='/transactions'></Navigate> : <Login />)}></Route>
          
          <Route path='/categories' element={(authUser ? <Categories /> : <Navigate to='/login'></Navigate>)}></Route>
          <Route path='/category' element={(authUser ? <Category /> : <Navigate to='/login'></Navigate>)}>
            <Route path=':categoryId' element={(authUser ? <Category /> : <Navigate to='/login'></Navigate>)}></Route>
          </Route>

          <Route path='/transactions' element={(authUser ? <Transactions /> : <Navigate to='/login'></Navigate>)}></Route>
          <Route path='/transaction' element={(authUser ? <Transaction /> : <Navigate to='/login'></Navigate>)}>
            <Route path=':transactionId' element={(authUser ? <Transaction /> : <Navigate to='/login'></Navigate>)}>
              <Route path=':categoryId' element={(authUser ? <Transaction /> : <Navigate to='/login'></Navigate>)}></Route>
            </Route>
          </Route>
        </Routes>

        {(ready && authUser) ? <AddTransactionFloatingButtons></AddTransactionFloatingButtons> : ''}
      </BrowserRouter>

      <Toaster></Toaster>
    </div>);
};

export default ExpensesApp;