import React, { useState, useMemo, useCallback } from 'react';
import Sidebar from './Components/Sidebar/Sidebar.jsx';
import OverallBalanceSection from './Components/OverallBalanceSection/OverallBalanceSection.jsx';
import SummaryTiles from './Components/SummaryTiles/SummaryTiles.jsx';

import {formatCurrency} from './Utils/Utils.jsx';

import { 
    Plus, BarChart2, DollarSign, Calendar, Tag, Clock, Trash2, Edit, X, AlertTriangle, 
    Menu, ChevronLeft, ChevronRight, Settings, Users 
} from 'lucide-react';

// --- MOCK DATA & Constants ---
const CATEGORIES = ['Food & Drink', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Salary', 'Other'];
const MOCK_BUDGET_DATA = [
  { category: 'Housing', subCategory: 'Rental', item: 'Rental', budget: 2100.00, actuals: { '202510': 2100.00, '202511': 0, '202512': 0 } },
  { category: 'Housing', subCategory: 'Utility', item: 'Electricity', budget: 250.00, actuals: { '202510': 206.40, '202511': 0, '202512': 0 } },
  { category: 'Housing', subCategory: 'Utility', item: 'Internet', budget: 105.00, actuals: { '202510': 104.94, '202511': 0, '202512': 0 } },
  { category: 'Transportation', subCategory: 'Car Loan', item: 'Grom', budget: 695.00, actuals: { '202510': 695.00, '202511': 0, '202512': 0 } },
  { category: 'Salary', subCategory: 'Income', item: 'Monthly Salary', budget: 5500.00, actuals: { '202510': 5500.00, '202511': 0, '202512': 0 } },
  { category: 'Other', subCategory: 'Unplanned', item: 'Unplanned Expenses', budget: 0.00, actuals: { '202510': 1761.00, '202511': 0, '202512': 0 } },
];
const BUDGET_MONTHS = ['202510', '202511', '202512'];
const MOCK_TRANSACTIONS = [
  { id: 't1', name: 'Rent Payment', amount: -2100.00, category: 'Housing', date: '2025-10-01', timestamp: new Date('2025-10-01T10:00:00') },
  { id: 't2', name: 'Monthly Salary', amount: 5500.00, category: 'Salary', date: '2025-10-05', timestamp: new Date('2025-10-05T15:30:00') },
  { id: 't3', name: 'Groceries (Weekly)', amount: -150.50, category: 'Food & Drink', date: '2025-10-06', timestamp: new Date('2025-10-06T08:15:00') },
].sort((a, b) => b.timestamp - a.timestamp); 

// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2,
//   }).format(amount);
// };

// --- CSS STYLES (Replaces Tailwind) ---
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

    :root {
        --color-primary: #4f46e5; /* indigo-600 */
        --color-primary-dark: #4338ca; /* indigo-700 */
        --color-secondary-dark: #1e293b; /* slate-800 */
        --color-bg-light: #f9fafb; /* gray-50 */
        --color-white: #ffffff;
        --color-text-dark: #1f2937; /* gray-800 */
        --color-text-light: #6b7280; /* gray-500 */
        --color-success: #10b981; /* green-500 */
        --color-danger: #ef4444; /* red-500 */
        --color-warning: #f59e0b; /* yellow-500 */
        --transition-duration: 0.3s;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
    }

    /* --- General Layout --- */
    .app-container {
        display: flex;
        min-height: 100vh;
        background-color: var(--color-bg-light);
    }

    .main-content {
        flex: 1;
        padding: 1rem; /* p-4 */
        transition: margin-left var(--transition-duration) ease-in-out;
    }
    
    @media (min-width: 640px) { /* sm:p-8 */
        .main-content {
            padding: 2rem;
        }
    }

    /* Sidebar margin management */
    .main-content-expanded {
        margin-left: 0;
    }
    .main-content-collapsed {
        margin-left: 0;
    }

    @media (min-width: 1024px) { /* lg: */
        .main-content-expanded {
            margin-left: 250px;
        }
        .main-content-collapsed {
            margin-left: 80px;
        }
    }
    
    /* --- Buttons and Inputs --- */
    .btn {
        padding: 0.625rem 1rem;
        font-weight: 600;
        border-radius: 0.5rem;
        transition: background-color var(--transition-duration), transform 0.1s;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .btn-primary {
        background-color: var(--color-primary);
        color: var(--color-white);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }
    .btn-primary:hover {
        background-color: var(--color-primary-dark);
        transform: translateY(-1px);
    }
    .btn-icon {
        padding: 0.5rem;
        border-radius: 9999px; /* full */
        background-color: transparent;
        border: none;
        cursor: pointer;
        transition: background-color var(--transition-duration), color var(--transition-duration);
    }
    .btn-icon:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    .input-field {
        width: 100%;
        border: 1px solid #d1d5db; /* gray-300 */
        border-radius: 0.5rem;
        padding: 0.625rem;
        font-size: 0.875rem;
    }

    /* --- Card/Panel Styling --- */
    .card {
        background-color: var(--color-white);
        padding: 1.5rem; /* p-6 */
        border-radius: 0.75rem; /* rounded-xl */
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        border: 1px solid #f3f4f6; /* gray-100 */
        margin-bottom: 2rem; /* mb-8 */
    }
    
    .card-header {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text-dark);
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f3f4f6;
    }
    
    /* --- Sidebar Specific --- */
    .sidebar {
        background-color: var(--color-secondary-dark);
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 40;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transition: all var(--transition-duration) ease-in-out;
        display: none; /* Hidden by default on mobile */
    }

    @media (min-width: 1024px) { /* lg:block */
        .sidebar {
            display: block;
        }
    }

    .sidebar-expanded {
        width: 250px;
    }

    .sidebar-collapsed {
        width: 80px;
    }

    .sidebar-header {
        padding: 1rem;
        border-bottom: 1px solid #334155; /* slate-700 */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .sidebar-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: #93c5fd; /* indigo-300/400 */
        letter-spacing: 0.05em;
        transition: opacity var(--transition-duration);
        white-space: nowrap;
        overflow: hidden;
    }

    .sidebar-toggle-btn {
        padding: 0.5rem; /* Increased click area */
        color: #94a3b8; /* slate-400 */
        transition: color var(--transition-duration), background-color var(--transition-duration);
        border-radius: 0.5rem;
        flex-shrink: 0;
        border: none;
        cursor: pointer;
    }
    .sidebar-toggle-btn:hover {
        color: var(--color-white);
        background-color: #334155; /* slate-700 */
    }

    .sidebar-nav {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 0.75rem;
        transition: background-color var(--transition-duration);
        color: #cbd5e1; /* slate-300 */
        cursor: pointer;
    }
    .nav-link:hover {
        background-color: #334155; /* slate-700 */
    }
    .nav-link-active {
        background-color: rgba(99, 102, 241, 0.3); /* indigo-600/50 */
        color: #a5b4fc; /* indigo-200 */
        font-weight: 600;
    }
    .nav-link-collapsed {
        justify-content: center;
    }
    .nav-link-text-hidden {
        display: none;
    }
    
    /* --- Balance Section --- */
    .balance-section {
        background: linear-gradient(to bottom right, #4f46e5, #6366f1); /* from-indigo-700 to-indigo-500 */
        color: var(--color-white);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        margin-bottom: 2rem;
    }
    .balance-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid rgba(129, 140, 248, 0.5); /* indigo-400/50 */
    }
    @media (min-width: 640px) {
        .balance-header {
            flex-direction: row;
            align-items: center;
        }
    }
    .balance-title {
        font-size: 0.875rem;
        font-weight: 300;
        opacity: 0.9;
    }
    .balance-amount {
        font-size: 2.25rem;
        font-weight: 800;
        margin-top: 0.25rem;
    }
    @media (min-width: 640px) {
        .balance-amount {
            font-size: 3rem;
        }
    }
    .metric-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        padding-top: 0.5rem;
    }
    @media (min-width: 640px) {
        .metric-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    .metric-item {
        padding: 1rem;
        background-color: #4f46e5; /* indigo-600 */
        border-radius: 0.75rem;
        box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(99, 102, 241, 0.5);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .metric-title {
        font-size: 0.75rem;
        font-weight: 500;
        opacity: 0.8;
        margin-bottom: 0.25rem;
    }
    .metric-value {
        font-size: 1.25rem;
        font-weight: 700;
    }
    .text-green-300 { color: #86efac; }
    .text-red-300 { color: #fca5a5; }

    /* --- Summary Tiles --- */
    .summary-tiles-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    @media (min-width: 640px) {
        .summary-tiles-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    .tile-item {
        background-color: var(--color-white);
        padding: 1.25rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .tile-label {
        color: var(--color-text-light);
        font-size: 0.875rem;
    }
    .tile-value {
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 0.25rem;
    }
    .tile-icon-bg {
        padding: 0.75rem;
        border-radius: 0.5rem;
    }
    .bg-green-100 { background-color: #d1fae5; }
    .text-green-600 { color: #059669; }
    .bg-red-100 { background-color: #fee2e2; }
    .text-red-600 { color: #dc2626; }
    .bg-indigo-100 { background-color: #e0e7ff; }
    .text-indigo-600 { color: #4f46e5; }
    
    /* --- Transaction History (UPDATED FOR 6 COLUMNS) --- */
    .transaction-grid-header, .transaction-grid-row {
        display: grid;
        /* Mobile: Name spans 2, Type 1, Actions 1. Category/Amount/Date are hidden but in flow. */
        grid-template-columns: 2fr 0fr 0fr 0fr 1fr 1fr; 
        gap: 1rem;
        padding: 0.75rem 0;
        align-items: center;
        font-size: 0.875rem;
    }
    .transaction-grid-header {
        font-weight: 500;
        color: var(--color-text-light);
        border-bottom: 1px solid #e5e7eb; /* gray-200 */
        text-transform: uppercase;
    }
    .transaction-grid-row {
        border-bottom: 1px solid #f3f4f6; /* gray-100 */
        transition: background-color 0.15s;
    }
    .transaction-grid-row:hover {
        background-color: #eef2ff; /* indigo-50 */
    }

    @media (min-width: 640px) { /* sm: Desktop layout - 6 equal columns */
        .transaction-grid-header, .transaction-grid-row {
            grid-template-columns: repeat(6, 1fr);
            gap: 1rem;
        }
    }
    
    /* Mobile Column Visibility Control */
    .tx-category-col-header, 
    .tx-amount-col-header, 
    .tx-date-col-header {
        display: none; /* Hide headers on mobile */
    }
    .tx-category-col, 
    .tx-amount-col, 
    .tx-date-col {
        display: none; /* Hide content on mobile */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (min-width: 640px) { /* sm: Make all columns visible on desktop */
        .tx-category-col-header, 
        .tx-amount-col-header, 
        .tx-date-col-header {
            display: block; 
        }
        .tx-category-col, 
        .tx-amount-col, 
        .tx-date-col {
            display: block; 
        }
        .tx-name-col-mobile { grid-column: span 1; } /* Name takes 1 column on desktop */
    }
    .tx-name-col-mobile { 
        grid-column: span 2; /* Name takes 2 columns on mobile */
    }
    .tx-income-text { color: var(--color-success); }
    .tx-expense-text { color: var(--color-danger); }

    .tx-status-badge {
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        border-radius: 9999px;
        text-align: center;
        display: inline-block;
    }
    .bg-status-income { background-color: #d1fae5; color: #047857; }
    .bg-status-expense { background-color: #fee2e2; color: #b91c1c; }
    .tx-actions-col {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        align-items: center;
    }

    /* --- Modals and Forms --- */
    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.4);
        padding: 1rem;
        backdrop-filter: blur(4px);
    }
    .modal-content {
        background-color: var(--color-white);
        border-radius: 0.75rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-width: 32rem; /* max-w-lg */
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(1);
        transition: transform var(--transition-duration);
    }
    .modal-close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem;
        color: #9ca3af;
        border-radius: 9999px;
        transition: color var(--transition-duration), background-color var(--transition-duration);
        border: none;
        background: none;
        cursor: pointer;
    }
    .modal-close-btn:hover {
        color: var(--color-text-dark);
        background-color: #f3f4f6;
    }

    /* --- Floating Action Button (FAB) --- */
    .fab {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        padding: 1rem;
        background-color: var(--color-primary);
        color: var(--color-white);
        border-radius: 9999px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        transition: background-color var(--transition-duration), transform var(--transition-duration);
        z-index: 40;
        border: none;
        cursor: pointer;
    }
    .fab:hover {
        background-color: var(--color-primary-dark);
        transform: scale(1.05);
    }
    @media (min-width: 1024px) {
        .fab {
            bottom: 2.5rem;
            right: 2.5rem;
        }
    }
`;

// Budget Grid Specific CSS (kept here for single file mandate)
const budgetGridStyles = `
    .budget-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr); 
        gap: 0.5rem; 
        padding: 0.5rem 0;
        font-size: 0.875rem;
    }
    .budget-grid-header {
        font-weight: 500;
        color: #6b7280;
        text-transform: uppercase;
        border-bottom: 1px solid #e5e7eb;
    }
    @media (min-width: 640px) { /* sm: */
        .budget-grid {
            grid-template-columns: repeat(6, 1fr);
        }
    }
    @media (min-width: 1024px) { /* lg: */
        .budget-grid {
            grid-template-columns: repeat(7, 1fr);
            gap: 0.75rem;
        }
    }

    .budget-grid-header > div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Helper classes for column visibility */
    .hidden-sm { display: none; }
    @media (min-width: 640px) { .hidden-sm { display: block; } }
    .hidden-lg { display: none; }
    @media (min-width: 1024px) { .hidden-lg { display: block; } }

    .grid-col-2-sm-1 {
        grid-column: span 2;
    }
    @media (min-width: 640px) {
        .grid-col-2-sm-1 {
            grid-column: span 1;
        }
    }
    .budget-month-col {
        display: none;
    }
    @media (min-width: 640px) {
        .budget-month-col {
            display: block;
        }
    }
    @media (min-width: 1024px) {
        .budget-month-col {
            display: block;
            grid-column: span 1;
        }
    }

    .budget-row {
        border-bottom: 1px solid #f3f4f6;
    }
    .budget-row:hover {
        background-color: #f9fafb;
    }
    .budget-row-unplanned {
        background-color: #fffbeb; /* yellow-50 */
        font-weight: 600;
        border-top: 1px solid #e5e7eb;
    }
    .budget-item-name {
        font-weight: 500;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .budget-summary-grid {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    @media (min-width: 768px) { /* md: */
        .budget-summary-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .summary-title-small {
        font-size: 0.875rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    .summary-row-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.375rem;
        padding-bottom: 0.375rem;
        font-size: 0.875rem;
    }
    .summary-row-title {
        color: #4b5563; /* gray-600 */
    }
    .summary-row-allocation-text {
        color: #9ca3af; /* gray-400 */
        font-weight: 400;
        font-size: 0.75rem;
        margin-left: 0.5rem;
        display: none;
    }
    @media (min-width: 640px) {
        .summary-row-allocation-text { display: inline; }
    }
    .summary-total-container {
        border-top: 1px solid #e5e7eb;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
    }
  `;

// Concatenate all CSS
const FullCSS = styles + budgetGridStyles;
  
// --- Main Application Component ---
const App = () => {
  // --- Local State Initialization (using mock data) ---
  const [expenses, setExpenses] = useState(MOCK_TRANSACTIONS);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ 
    isOpen: false, 
    expenseToDelete: null 
  }); 

  // State for Collapsible Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handler for Sidebar Toggle
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  // New Expense Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10)); 
  const [transactionType, setTransactionType] = useState('expense'); 


  // --- Handlers (Local State Operations) ---
  const handleAddExpense = useCallback((e, onClose) => {
    e.preventDefault();

    let parsedAmount = parseFloat(amount);
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error("Invalid input detected.");
      return;
    }

    if (transactionType === 'expense') {
      parsedAmount = -Math.abs(parsedAmount); 
    } else {
      parsedAmount = Math.abs(parsedAmount); 
    }

    const newExpense = {
        id: crypto.randomUUID(),
        name: name.trim(),
        amount: parsedAmount,
        category: category,
        date: date,
        timestamp: new Date(),
    };

    setExpenses(prev => [newExpense, ...prev].sort((a, b) => b.timestamp - a.timestamp));

    // Reset form fields
    setName('');
    setAmount('');
    setCategory(CATEGORIES[0]);
    setDate(new Date().toISOString().substring(0, 10));

    if (onClose) onClose();

  }, [name, amount, category, date, transactionType]);

  const handleDeleteExpense = useCallback((expenseId) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    setDeleteConfirmation({ isOpen: false, expenseToDelete: null });
  }, []);


  // --- Derived State (Memoization for Performance) ---
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const totalPositive = useMemo(() => {
    return expenses.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const totalNegative = useMemo(() => {
    return expenses.filter(e => e.amount < 0).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);
  
  // --- Derived State (Time-Based Balances) ---
  const dailyBalance = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expenses
        .filter(e => e.timestamp && e.timestamp >= today)
        .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const weeklyBalance = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    return expenses
        .filter(e => e.timestamp && e.timestamp >= oneWeekAgo)
        .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const monthlyBalance = useMemo(() => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    return expenses
        .filter(e => e.timestamp && e.timestamp >= startOfMonth)
        .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);
  
  // --- UI Components ---
  
  // Helper for formatting Summary Rows in the budget grid
  const SummaryRow = ({ title, value, valueClassName, isBudget = false, totalAllocation = null }) => (
      <div className="summary-row-item">
          <span className={`summary-row-title ${isBudget ? 'ml-4' : ''}`}>{title}</span>
          <span className={valueClassName}>
              {formatCurrency(value)}
              {totalAllocation !== null && (
                  <span className="summary-row-allocation-text">
                      (of {formatCurrency(totalAllocation)})
                  </span>
              )}
          </span>
      </div>
  );

  // Component for the Monthly Budget/Actuals Grid
  const MonthlyBudgetGrid = ({ data, months }) => {
      const currentMonth = months[0]; 

      const monthlyExpPlanned = useMemo(() => 
          data.reduce((sum, item) => sum + item.budget, 0), [data]
      );

      const totalActualSpentCurrentMonth = useMemo(() => 
          data.reduce((sum, item) => sum + (item.actuals[currentMonth] || 0), 0), [data, currentMonth]
      );

      const dailyExpPlanned = monthlyExpPlanned / 30; 
      const weeklyAllocation = monthlyExpPlanned / (30/7); 
      const totalRemaining = monthlyExpPlanned - totalActualSpentCurrentMonth;

      const mockWeeklyData = [
          { label: 'Remain Week 1', value: 87.01, totalAllocation: weeklyAllocation },
          { label: 'Remain Week 2', value: weeklyAllocation * 0.5, totalAllocation: weeklyAllocation },
          { label: 'Remain Week 3', value: weeklyAllocation * 0.8, totalAllocation: weeklyAllocation },
          { label: 'Remain Week 4', value: weeklyAllocation, totalAllocation: weeklyAllocation },
          { label: 'Remain Week 5', value: 320.60, totalAllocation: 320.60 },
      ];


      // --- Render Logic ---
      return (
          <div className="card">
              <h2 className="card-header">
                  Monthly Fixed Budget & Actuals
              </h2>

              {/* Header */}
              <div className="budget-grid budget-grid-header">
                  <div className="hidden-lg">Category</div>
                  <div className="hidden-lg">Sub Category</div>
                  <div className="grid-col-2-sm-1">Item</div>
                  <div className="text-right">Budget</div>
                  {months.map(month => (
                      <div key={month} className="text-right hidden-sm budget-month-col">
                          {month}
                      </div>
                  ))}
              </div>

              {/* Budget Rows */}
              {data.map((item, index) => {
                  const isUnplanned = item.item === 'Unplanned Expenses';
                  const rowClass = isUnplanned ? 'budget-row-unplanned' : 'budget-row';

                  return (
                      <div key={index} className={`budget-grid ${rowClass}`}>
                          {/* Categories (Desktop only) */}
                          <div className="text-gray-700 hidden-lg budget-item-col">{item.category}</div>
                          <div className="text-gray-500 hidden-lg budget-item-col">{item.subCategory}</div>
                          
                          {/* Item Name */}
                          <div className="grid-col-2-sm-1 font-medium budget-item-name">{item.item}</div>
                          
                          {/* Budget */}
                          <div className="text-right font-medium text-indigo-600">
                              {formatCurrency(item.budget)}
                          </div>
                          
                          {/* Actual Spend Columns (Months) */}
                          {months.map(month => {
                              const actual = item.actuals[month];
                              const actualColorClass = actual > item.budget ? 'text-red-500' : 'text-gray-700';
                              
                              return (
                                  <div key={month} className={`text-right hidden-sm ${actualColorClass}`}>
                                      {actual ? formatCurrency(actual) : '-'}
                                  </div>
                              );
                          })}
                      </div>
                  );
              })}
              
              {/* --- Summary Section --- */}
              <div className="budget-summary-grid">
                
                {/* 1. Monthly Totals */}
                <div>
                    <h4 className="summary-title-small">Monthly Budget Summary ({currentMonth})</h4>
                    <SummaryRow 
                        title="Monthly Exp Planned (Budget)" 
                        value={monthlyExpPlanned} 
                        valueClassName="text-indigo-600 font-extrabold" 
                    />
                    <SummaryRow 
                        title="Monthly Exp Actual (Total Spent)" 
                        value={totalActualSpentCurrentMonth} 
                        valueClassName="text-red-600 font-extrabold" 
                    />
                    <SummaryRow 
                        title="Monthly Net Remaining" 
                        value={totalRemaining} 
                        valueClassName={`font-extrabold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`} 
                    />
                </div>

                {/* 2. Weekly Status and Grand Totals */}
                <div>
                    <h4 className="summary-title-small">Weekly Status & Grand Totals</h4>
                    <SummaryRow title="Daily Exp Planned" value={dailyExpPlanned} valueClassName="text-gray-700" />
                    
                    {mockWeeklyData.map((week, index) => (
                        <SummaryRow 
                            key={index} 
                            title={week.label} 
                            value={week.value} 
                            valueClassName={`font-bold ${week.value >= 0 ? 'text-green-600' : 'text-red-600'}`} 
                            isBudget={true}
                            totalAllocation={weeklyAllocation}
                        />
                    ))}
                     <div className="summary-total-container">
                        <SummaryRow title="TOTAL SPENT (Current Month)" value={totalActualSpentCurrentMonth} valueClassName="text-red-700 font-extrabold text-lg" />
                        <SummaryRow title="TOTAL REMAINING (Budget - Actual)" value={totalRemaining} valueClassName={`font-extrabold text-lg ${totalRemaining >= 0 ? 'text-green-700' : 'text-red-700'}`} />
                    </div>
                </div>

              </div>
          </div>
      );
  };
  
  // Generic Modal Component
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div 
        className="modal-overlay"
        onClick={onClose} 
      >
        <div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
          
          {children}
        </div>
      </div>
    );
  };
  
  // Delete Confirmation Modal Content
  const DeleteConfirmationModal = ({ expense, onConfirm, onCancel }) => {
    return (
        <div className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" style={{ color: '#ef4444', margin: '0 auto 1rem', width: '3rem', height: '3rem' }} />
            <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Confirm Deletion</h2>
            <p className="text-gray-600 mb-6" style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                Are you sure you want to delete the transaction: 
                <span className="font-semibold text-red-700 ml-1" style={{ fontWeight: 600, color: '#b91c1c', marginLeft: '0.25rem' }}>{expense.name}</span>?
                This action cannot be undone.
            </p>
            <p className="text-lg font-bold text-gray-800 mb-6" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem' }}>
                Amount: {formatCurrency(expense.amount)}
            </p>
            <div className="flex justify-center space-x-4" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                    onClick={onCancel}
                    className="btn"
                    style={{ backgroundColor: '#e5e7eb', color: '#374151', fontWeight: 600, padding: '0.5rem 1rem', transition: 'background-color 0.1s' }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => onConfirm(expense.id)}
                    className="btn"
                    style={{ backgroundColor: '#dc2626', color: 'white', fontWeight: 600, padding: '0.5rem 1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                >
                    Yes, Delete It
                </button>
            </div>
        </div>
    );
  };


  // New Expense Form Component (Inline)
  const TransactionFormContent = ({ onClose }) => {
    const handleSubmit = (e) => handleAddExpense(e, onClose);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b pb-3" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                <Plus className="w-6 h-6 mr-2 text-indigo-600" style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem', color: '#4f46e5' }} /> Record New Transaction
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {/* Transaction Type Selector (Income/Expense) */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        type="button"
                        onClick={() => setTransactionType('expense')}
                        style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, transition: 'background-color 0.3s', 
                            backgroundColor: transactionType === 'expense' ? '#ef4444' : '#f3f4f6', 
                            color: transactionType === 'expense' ? 'white' : '#4b5563', 
                            boxShadow: transactionType === 'expense' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none', border: 'none', cursor: 'pointer' 
                        }}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setTransactionType('income')}
                        style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, transition: 'background-color 0.3s', 
                            backgroundColor: transactionType === 'income' ? '#10b981' : '#f3f4f6', 
                            color: transactionType === 'income' ? 'white' : '#4b5563', 
                            boxShadow: transactionType === 'income' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none', border: 'none', cursor: 'pointer' 
                        }}
                    >
                        Income
                    </button>
                </div>

                {/* Name Input */}
                <div>
                    <label htmlFor="name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>Description</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Starbucks or Monthly Salary"
                        required
                        className="input-field"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Amount Input */}
                    <div>
                        <label htmlFor="amount" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>Amount ($)</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 50.00"
                            required
                            step="0.01"
                            min="0.01"
                            className="input-field"
                        />
                    </div>

                    {/* Date Input */}
                    <div>
                        <label htmlFor="date" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>Date</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Category Dropdown */}
                <div>
                    <label htmlFor="category" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field"
                        style={{ appearance: 'none' }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.5rem', padding: '0.625rem 0' }}
                >
                    Save Transaction
                </button>
            </form>
        </div>
    );
  };

  // Small Summary Cards (Income/Expense/Category)
  const SummaryTilesOld = () => (
    <div className="summary-tiles-grid">
      {/* Total Income */}
      <div className="tile-item">
        <div>
          <p className="tile-label">Total Income</p>
          <p className="tile-value text-green-600">{formatCurrency(totalPositive)}</p>
        </div>
        <div className="tile-icon-bg bg-green-100">
          <DollarSign className="w-5 h-5 text-green-600" style={{ width: '1.25rem', height: '1.25rem' }} />
        </div>
      </div>
      {/* Total Expenses */}
      <div className="tile-item">
        <div>
          <p className="tile-label">Total Expenses</p>
          <p className="tile-value text-red-600">{formatCurrency(Math.abs(totalNegative))}</p>
        </div>
        <div className="tile-icon-bg bg-red-100">
          <Trash2 className="w-5 h-5 text-red-600" style={{ width: '1.25rem', height: '1.25rem' }} />
        </div>
      </div>
      {/* Available Categories Count */}
      <div className="tile-item">
        <div>
          <p className="tile-label">Categories</p>
          <p className="tile-value text-indigo-600">{CATEGORIES.length}</p>
        </div>
        <div className="tile-icon-bg bg-indigo-100">
          <Tag className="w-5 h-5 text-indigo-600" style={{ width: '1.25rem', height: '1.25rem' }} />
        </div>
      </div>
    </div>
  );

  // Transaction Row
  const TransactionRow = ({ expense, onDeleteClick }) => {
    const isIncome = expense.amount > 0;
    const amountColorClass = isIncome ? 'tx-income-text' : 'tx-expense-text';
    const sign = isIncome ? '+' : ''; 
    const absoluteAmount = Math.abs(expense.amount);
    const statusColorClass = isIncome ? 'bg-status-income' : 'bg-status-expense';
    const statusText = isIncome ? 'Income' : 'Expense';

    return (
      <div className="transaction-grid-row">
        {/* 1. Merchant Name (Takes 2 columns on mobile) */}
        <div className="font-medium text-gray-800 tx-name-col-mobile">{expense.name}</div>
        
        {/* 2. Category (Hidden on mobile) */}
        <div className="text-gray-500 tx-category-col">{expense.category}</div>

        {/* 3. Amount (Hidden on mobile) */}
        <div className={`font-semibold tx-amount-col ${amountColorClass}`}>
          {sign}{formatCurrency(absoluteAmount)}
        </div>
        
        {/* 4. Date (Hidden on mobile) */}
        <div className="text-gray-500 tx-date-col">{expense.date}</div>
        
        {/* 5. Status/Type (Visible on mobile and desktop) */}
        <div className="flex justify-start sm:justify-center">
            <span className={`tx-status-badge ${statusColorClass}`}>
              {statusText}
            </span>
        </div>

        {/* 6. Actions (Visible on mobile and desktop) */}
        <div className="tx-actions-col">
            {/* Delete Button */}
            <button
                onClick={() => onDeleteClick(expense)}
                className="btn-icon"
                style={{ color: '#ef4444' }}
                title="Delete Transaction"
            >
                <Trash2 className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
            </button>
            {/* Edit Button Placeholder */}
            <button
                className="btn-icon"
                style={{ color: '#4f46e5' }}
                title="Edit Transaction"
                disabled 
            >
                <Edit className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
            </button>
        </div>
      </div>
    );
  };


  // --- Main Render ---
  const sidebarMarginClass = isSidebarOpen ? 'main-content-expanded' : 'main-content-collapsed';

  return (
    <>
      <style>{FullCSS}</style>
      <div className="app-container">
        {/* 1. Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* 2. Main Content Area */}
        <div className={`main-content ${sidebarMarginClass}`}>
          
          {/* Top Header/Search Bar (Simulated) */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)' }}>
              
              {/* Hamburger Button for Mobile/Tablet */}
              {/* <button
                  onClick={toggleSidebar}
                  className="btn-icon"
                  style={{ display: 'block', marginRight: '0.75rem', color: '#4b5563' }}
              >
                  <Menu className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
              </button> */}
              
              <div style={{ position: 'relative', width: '100%', maxWidth: '36rem' }}>
                  <input
                      type="text"
                      placeholder="Search for merchants or item..."
                      style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '9999px', fontSize: '0.875rem' }}
                  />
                  <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
               {/* Spacer for alignment on desktop, where mobile menu is hidden */}
              <div className="hidden-lg" style={{ width: '2rem' }}></div>
          </div>

          {/* 1. BALANCE SECTION (Overall + Daily/Weekly/Monthly) */}
          <OverallBalanceSection
            total={totalExpenses}
            daily={dailyBalance}
            weekly={weeklyBalance}
            monthly={monthlyBalance}
          />
          
          {/* 2. SUMMARY TILES (Income/Expense/Category) */}
          <SummaryTilesOld />
          <SummaryTiles categories={CATEGORIES} expenses={expenses} />
          
          {/* 3. MONTHLY FIXED BUDGET GRID */}
          <MonthlyBudgetGrid data={MOCK_BUDGET_DATA} months={BUDGET_MONTHS} />


          {/* 4. TRANSACTION HISTORY (Full Width) */}
          <div style={{ marginTop: '2rem' }}>
              <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                      <h2 className="text-xl font-bold text-gray-800" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>Transaction History</h2>
                      <button 
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#4f46e5', transition: 'color 0.1s', border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                          <Plus className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
                          <span>Add New</span>
                      </button>
                  </div>

                  {/* Transaction Table Header (6 Columns) */}
                  <div className="transaction-grid-header">
                      <div className="tx-name-col-mobile">Name</div>
                      <div className="tx-category-col-header tx-category-col">Category</div> 
                      <div className="tx-amount-col-header tx-amount-col">Amount</div>
                      <div className="tx-date-col-header tx-date-col">Date</div>
                      <div style={{ textAlign: 'center' }}>Type</div>
                      <div style={{ textAlign: 'right' }}>Actions</div>
                  </div>

                  {/* Transaction List */}
                  <div style={{ marginTop: '0.5rem' }}>
                      {expenses.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                              No transactions recorded yet. Click 'Add New' or the floating button to start!
                          </div>
                      )}

                      {expenses.map(expense => (
                          <TransactionRow 
                            key={expense.id} 
                            expense={expense}
                            onDeleteClick={(exp) => setDeleteConfirmation({ isOpen: true, expenseToDelete: exp })}
                          />
                      ))}
                  </div>
              </div>
          </div>
        </div>
        
        {/* FLOATING ACTION BUTTON (FAB) */}
        <button
          onClick={() => setShowModal(true)}
          className="fab"
          title="Add New Transaction"
        >
          <Plus className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>

        {/* 1. ADD TRANSACTION MODAL CONTAINER */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <TransactionFormContent onClose={() => setShowModal(false)} />
        </Modal>
        
        {/* 2. DELETE CONFIRMATION MODAL CONTAINER */}
        <Modal 
          isOpen={deleteConfirmation.isOpen} 
          onClose={() => setDeleteConfirmation({ isOpen: false, expenseToDelete: null })}
        >
          {deleteConfirmation.expenseToDelete && (
              <DeleteConfirmationModal
                  expense={deleteConfirmation.expenseToDelete}
                  onConfirm={handleDeleteExpense}
                  onCancel={() => setDeleteConfirmation({ isOpen: false, expenseToDelete: null })}
              />
          )}
        </Modal>

      </div>
    </>
  );
};

export default App;
