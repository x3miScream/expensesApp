import React, {useState, useCallback} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuthContext} from './Context/AuthContext.jsx';

import Sidebar from './Components/Sidebar/Sidebar.jsx';
import Home from './Features/Home/Home.jsx';
import LoginScreen from './Components/Auth/LoginScreen.jsx';

const ExpenseApp = () => {
    const {authUser, ready} = useAuthContext();

    
    
    // State for Collapsible Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // Handler for Sidebar Toggle
    const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
    // --- Main Render ---
    const sidebarMarginClass = (isSidebarOpen??false) ? 'main-content-expanded' : 'main-content-collapsed';


    return (
    <div className='App'>

      <div className="app-container">
        {/* 1. Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* 2. Main Content Area */}
        <div className={`main-content ${sidebarMarginClass}`}>
          <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<Home></Home>}></Route> */}
              <Route path="/" element={(authUser ? <Home></Home> : <Navigate to='/login'></Navigate>)}></Route>
              <Route path='/login' element={(authUser ? <Navigate to='/'></Navigate> : <LoginScreen />)}></Route>
            </Routes>
        </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default ExpenseApp;