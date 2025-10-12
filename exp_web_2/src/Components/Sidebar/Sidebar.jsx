import React from 'react';
import {  BarChart2, DollarSign, Calendar, Tag, Clock, ChevronLeft, ChevronRight, Menu, Settings, Users } from 'lucide-react';

import './Sidebar.css';


const Sidebar = ({ isOpen, onToggle }) => {
    const currentWidthClass = isOpen ? 'sidebar-expanded' : 'sidebar-collapsed';
    
    // Links with placeholder icons
    const links = [
        { name: 'Dashboard', icon: BarChart2, active: true },
        { name: 'Your Shop', icon: Tag, active: false },
        { name: 'Pay Merchant', icon: DollarSign, active: false },
        { name: 'Orders', icon: Calendar, active: false },
        { name: 'Reports', icon: Settings, active: false },
        { name: 'Collections', icon: Users, active: false },
        { name: 'Repayments', icon: Clock, active: false },
        { name: 'Wallet', icon: Tag, active: false },
        { name: 'Manage', icon: Settings, active: false }
    ];

    return (
      // Apply dynamic width class
      <div className={`sidebar ${currentWidthClass}`}>
        <div className="sidebar-header">
          {/* Logo/Title - Hide text when collapsed */}
          <h1 className="sidebar-title" style={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}>
            <DollarSign className="inline w-6 h-6 mr-1" style={{ display: 'inline', width: '1.5rem', height: '1.5rem', marginRight: '0.25rem' }} /> ExpApp
          </h1>
          
          {/* Collapse/Expand Toggle Button - Now has increased click area via p-2 padding in CSS */}
          <button
                  onClick={onToggle}
                  className="btn-icon"
                  style={{ display: 'block', marginRight: '0.75rem', color: '#e5e7eb' }}
              >
                  <Menu className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
              </button>
        </div>
        
        <nav className="sidebar-nav">
          {links.map((item) => (
            <div 
              key={item.name} 
              className={`nav-link ${item.active ? 'nav-link-active' : ''} ${isOpen ? '' : 'nav-link-collapsed'}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
              {/* Hide text when collapsed */}
              <span className={isOpen ? '' : 'nav-link-text-hidden'}>{item.name}</span>
            </div>
          ))}
        </nav>
      </div>
    );
};

export default Sidebar;