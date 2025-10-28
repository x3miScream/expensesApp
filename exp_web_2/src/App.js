import React, {useState} from 'react';
import './App.css';
import ExpenseApp from './ExpenseApp.jsx';
import { AuthContextProvider } from './Context/AuthContext.jsx';
  
// --- Main Application Component ---
const App = () => {
  return (
    <div className='App'>
      <AuthContextProvider>
        <ExpenseApp></ExpenseApp>  
      </AuthContextProvider>
    </div>
  );
};

export default App;
