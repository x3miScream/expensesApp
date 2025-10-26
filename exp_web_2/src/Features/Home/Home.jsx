import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';
import OverallBalanceSection from '../../Components/OverallBalanceSection/OverallBalanceSection.jsx';
import SummaryTiles from '../../Components/SummaryTiles/SummaryTiles.jsx';
import MonthlyBudgetGrid from '../../Components/MonthlyBudgetGrid/MonthlyBudgetGrid.jsx';
import Modal from '../../Components/Modal/Modal.jsx';

import useTransactionCreateUdpateDelete from '../../Hooks/useTransactionCreateUdpateDelete.jsx';
import useCategoryCRUD from '../../Hooks/useCategoryCRUD.jsx';
import useGetRecurringTransactions from '../../Hooks/useGetRecurringTransactions.jsx';

import {formatCurrency} from '../../Utils/Utils.jsx';

import { 
    Plus, BarChart2, DollarSign, Calendar, Tag, Clock, Trash2, Edit, X, AlertTriangle, 
    Menu, ChevronLeft, ChevronRight, Settings, Users 
} from 'lucide-react';

// --- MOCK DATA & Constants ---
import { CATEGORIES, MOCK_BUDGET_DATA, MOCK_TRANSACTIONS, BUDGET_MONTHS } from '../../data/dummyData.jsx';

  
// --- Main Application Component ---
const Home = () => {
  // --- Local State Initialization (using mock data) ---
  const [categories, setCategories] = useState(CATEGORIES);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [expenses, setExpenses] = useState(MOCK_TRANSACTIONS);
  const [showModal, setShowModal] = useState(false);
  const [editTransactionData, setEditTransactionData] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ 
    isOpen: false, 
    expenseToDelete: null 
  }); 

  const {saveLoadingState, createTransaction, updateTransaction, getTransactions, deleteTransaction} = useTransactionCreateUdpateDelete();
  const {getCategories} = useCategoryCRUD();
  const {getRecurringTransactiosn} = useGetRecurringTransactions();

  // State for Collapsible Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handler for Sidebar Toggle
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  // New Expense Form State
  const recurringItemRefs = useRef([]);
  const transactionIdRef = useRef('');
  const nameRef = useRef('');
  const amountRef = useRef(null);
  const categoryRef = useRef(null);
  const recurringTransactionRef = useRef(null);
  const dateRef = useRef(new Date().toISOString().substring(0, 10));

  // const [date, setDate] = useState(new Date().toISOString().substring(0, 10)); 
  const [transactionType, setTransactionType] = useState('expense'); 


  useEffect(() => {
    getCategories(setCategories);
    getTransactions(setExpenses);
    getRecurringTransactiosn(setRecurringTransactions);
  }, []);

  // --- Handlers (Local State Operations) ---
  const handleAddExpense = useCallback((e, onClose, transactionId) => {
    e.preventDefault();

    let parsedAmount = parseFloat(amountRef.current.value);
    if (!nameRef.current.value || isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error("Invalid input detected.");
      return;
    }

    if (transactionType === 'expense') {
      parsedAmount = -Math.abs(parsedAmount); 
    } else {
      parsedAmount = Math.abs(parsedAmount); 
    }

    const categoryName = categories.filter((item) => item.id === categoryRef?.current?.value)[0]?.categoryName;

    const newExpense = {
        id: crypto.randomUUID(),
        name: nameRef.current.value.trim(),
        amount: parsedAmount,
        category: categoryName,
        date: dateRef?.current?.value,
        timestamp: new Date(),
    };

    const newTransactionCRUD = {
      id: transactionId,
      categoryId: categoryRef?.current?.value,
      description: nameRef.current.value.trim(),
      amount: parsedAmount,
      transactionType: transactionType === 'expense' ? 1 : 0,
      recurringItemId: recurringTransactionRef?.current?.value,
      transactionDateTime: dateRef?.current?.value
    }

    if(transactionId === undefined || transactionId === null)
      createTransaction(newTransactionCRUD, getTransactions(setExpenses));
    else
      updateTransaction(newTransactionCRUD, getTransactions(setExpenses));

    // if(transactionId === undefined || transactionId === null)
    //   setExpenses(prev => [newExpense, ...prev].sort((a, b) => b.timestamp - a.timestamp));

    // Reset form fields
    nameRef.current.value = '';
    amountRef.current.value = '';
    categoryRef.current.value = categories[0].id;
    dateRef.current.value = new Date().toISOString().substring(0, 10)

    if (onClose) onClose();

  }, [nameRef?.current?.value, amountRef?.current?.value, categoryRef?.current?.value, dateRef?.current?.value, transactionType]);

  const handleDeleteExpense = useCallback((expenseId) => {
    deleteTransaction(expenseId);
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

  const SetTransactionEditData = (transaction) => {
    setEditTransactionData(transaction);
    setShowModal(true);
  };

  const SetTransactionAddData = (transaction) => {
    setEditTransactionData(null);
    setShowModal(true);
  };

  const CloseTransactionWindow = () => {
    setEditTransactionData(null);
    setShowModal(false);
  };

  // New Expense Form Component (Inline)
  const TransactionFormContent = ({ onClose }) => {
    const handleSubmit = (e) => handleAddExpense(e, onClose, editTransactionData?.id);

    const onCategorySelectChange = (e) => {
      recurringItemRefs.current.forEach((item, index) => {
        if(item.getAttribute('categoryId') !== e.target.value)
        {
          item.style.display = 'none';
        }
        else{
          item.style.display = '';
        }
      });
    };

    useEffect(() => {
      if(editTransactionData !== null && editTransactionData !== undefined)
      {
        if(editTransactionData.transactionType === 1){
          setTransactionType('expense');
        }
        else{
          setTransactionType('income');
        }

        nameRef.current.value = editTransactionData.name;
        amountRef.current.value = Math.abs(editTransactionData.amount);
        categoryRef.current.value = editTransactionData.categoryId;
        recurringTransactionRef.current.value = editTransactionData.recurringItemId;
        dateRef.current.value = new Date(editTransactionData.dateVal).toISOString().substring(0, 10);
      }
      else{
        dateRef.current.value = new Date().toISOString().substring(0, 10);
      }
    }, []);

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
                        ref={nameRef}
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
                            ref={amountRef}
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
                            ref={dateRef}
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
                        ref={categoryRef}
                        onChange={onCategorySelectChange}
                        className="input-field"
                        style={{ appearance: 'none' }}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                        ))}
                    </select>
                </div>
                
                {/* Recurring Transactions */}
                <div>
                    <label htmlFor="recurringTransaction" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>Recurring Transaction</label>
                    <select
                        id="recurringTransaction"
                        ref={recurringTransactionRef}
                        className="input-field"
                        style={{ appearance: 'none' }}
                    >
                        <option key='0' value='' selected></option>

                        {recurringTransactions.map((recItem, index) => (
                            <option ref={(el) => recurringItemRefs.current[index] = el} key={recItem.recurringItemId} categoryId={recItem.categoryId} value={recItem.recurringItemId}>{`${recItem.categoryName} | ${recItem.recurringItemName}`}</option>
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

  // Transaction Row
  const TransactionRow = ({ expense, onDeleteClick, onEditClick }) => {
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
                onClick={() => onEditClick(expense)}
                className="btn-icon"
                style={{ color: '#4f46e5' }}
                title="Edit Transaction"
                disabled={false}
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
          <SummaryTiles categories={categories} expenses={expenses} />
          
          {/* 3. MONTHLY FIXED BUDGET GRID */}
          <MonthlyBudgetGrid months={BUDGET_MONTHS} />

          {/* 4. TRANSACTION HISTORY (Full Width) */}
          <div style={{ marginTop: '2rem' }}>
              <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                      <h2 className="text-xl font-bold text-gray-800" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>Transaction History</h2>
                      <button 
                        onClick={() => SetTransactionAddData()}
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
                            onEditClick={SetTransactionEditData}
                          />
                      ))}
                  </div>
              </div>
          </div>
        </div>
        
        {/* FLOATING ACTION BUTTON (FAB) */}
        <button
          onClick={() => SetTransactionAddData()}
          className="fab"
          title="Add New Transaction"
        >
          <Plus className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>

        {/* 1. ADD TRANSACTION MODAL CONTAINER */}
        <Modal isOpen={showModal} onClose={() => CloseTransactionWindow()}>
          <TransactionFormContent onClose={() => CloseTransactionWindow()} />
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

export default Home;
