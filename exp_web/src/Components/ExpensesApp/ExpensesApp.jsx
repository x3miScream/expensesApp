import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Categories from '../../Pages/Categories/Categories.jsx';
import Transactions from '../../Pages/Transactions/Transactions.jsx';
import Transaction from '../../Pages/Transaction/Transaction.jsx';
import Navbar from '../NavBar/NavBar.jsx';

import './ExpensesApp.css';

const ExpensesApp = () => {
    return(<div className='expenses-app-container'>
        <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path='/' element={<Categories />}></Route>
          <Route path='/categories' element={<Categories />}></Route>
          <Route path='/transactions' element={<Transactions />}></Route>
          <Route path='/transaction' element={<Transaction />}>
            <Route path=':transactionId' element={<Transaction />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>);
};

export default ExpensesApp;