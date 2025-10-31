import React, {useMemo, useState, useEffect, useRef} from 'react';
import {formatCurrency} from '../../Utils/Utils.jsx';
import SummaryRow from './SummaryRow.jsx';

import './MonthlyBudgetGrid.css';

import useGetMonthlyBudget from '../../Hooks/useGetMonthlyBudget.jsx';

const MonthlyBudgetGrid = ({ months }) => {
    const gridHeaderRef = useRef();

    const categoryColRef = useRef();
    const itemColRef = useRef();
    const budgetRef = useRef();

    const gridDataRefs = useRef([]);
    const [monthlyBudgetData, setMonthlyBudgetData] = useState([]);
    const [monthlyBudgetSummaryData, setMonthlyBudgetSummaryData] = useState({});
    const {getMonthlyBudgetDetails, getMonthlyBudgetSummary} = useGetMonthlyBudget();

    useEffect(() => {
        console.log('asdf');
        getMonthlyBudgetDetails(setMonthlyBudgetData);
        getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);
    }, []);

    useEffect(() => {
        updateGridColumns();
    }, [months, monthlyBudgetData]);

    const currentMonth = months[0]; 

    const updateGridColumns = () => {
        let gridColsTemplate = '2fr 1fr';

        const catColComputedStyle = window.getComputedStyle(categoryColRef.current);

        if(catColComputedStyle.display !== 'none')
            gridColsTemplate = '2fr ' + gridColsTemplate;

        months.forEach((item, index) => {
            gridColsTemplate += ' 1fr';
        });

        gridHeaderRef.current.style.gridTemplateColumns = gridColsTemplate;

        gridDataRefs.current.forEach((ref, index) => {
            if(ref)
            {
                ref.style.gridTemplateColumns = gridColsTemplate;
            }
        });
    };

    // --- Render Logic ---
    return (
        <div className="card">
            <h2 className="card-header">
                Monthly Fixed Budget & Actuals
            </h2>

            {/* Header fixed columns */}
            <div ref={gridHeaderRef} id='qwer' className="budget-grid budget-grid-header">
                <div ref={categoryColRef} className="label-col hidden-lg">Category</div>
                <div ref={itemColRef} className="label-col grid-col-2-sm-1">Item</div>
                <div ref={budgetRef} className="label-col text-right">Budget</div>
                {months.map(month => (
                    <div key={month} className="data-col text-right hidden-sm budget-month-col">
                        {month}
                    </div>
                ))}
            </div>

            {/* Budget Rows */}
            {monthlyBudgetData.map((item, index) => {
                const isUnplanned = item.recurringItemName === 'Unplanned Expenses';
                const rowClass = isUnplanned ? 'budget-row-unplanned' : 'budget-row';

                return (
                    <div ref={el => gridDataRefs.current[index] = el} key={index} className={`budget-grid ${rowClass}`}>
                        {/* Categories (Desktop only) */}
                        <div className="text-gray-700 hidden-lg budget-item-col">{item.categoryName}</div>
                        
                        {/* Item Name */}
                        <div className="grid-col-2-sm-1 font-medium budget-item-name">{item.recurringItemName}</div>
                        
                        {/* Budget */}
                        <div className="text-right font-medium text-indigo-600">
                            {formatCurrency(item.plannedBudget)}
                        </div>
                    
                        {/* Actual Spend Columns (Months) */}
                        {months.map(month => {
                            const actual = item.runningAmountByPeriod[month];
                            const actualColorClass = actual > item.plannedBudget ? 'text-red-500' : 'text-gray-700';
                            
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
                    value={monthlyBudgetSummaryData.totalMonthlyBudget} 
                    valueClassName="text-indigo-600 font-extrabold" 
                />
                <SummaryRow 
                    title="Monthly Exp Actual (Total Spent)" 
                    value={monthlyBudgetSummaryData.totalMonthlyExpenses} 
                    valueClassName="text-red-600 font-extrabold" 
                />
                <SummaryRow 
                    title="Monthly Net Remaining" 
                    value={monthlyBudgetSummaryData.monthlyRemainingBudget} 
                    valueClassName={`font-extrabold ${monthlyBudgetSummaryData.monthlyRemainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} 
                />
            </div>

            {/* 2. Weekly Status and Grand Totals */}
            <div>
                <h4 className="summary-title-small">Weekly Status & Grand Totals</h4>
                <SummaryRow title="Daily Exp Remaining" value={monthlyBudgetSummaryData.dailyRemainingBudget} valueClassName="text-gray-700" />
                
                {monthlyBudgetSummaryData.weeklyRemainingBudget?.map((week, index) => (
                    <SummaryRow 
                        key={index} 
                        title={`Remain Week ${week.weekNumber}`} 
                        value={week.weeklyRemainingBudget} 
                        valueClassName={`font-bold ${week.weeklyRemainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} 
                        isBudget={true}
                        totalAllocation={week.weeklyPlannedBudget}
                    />
                ))}
                    <div className="summary-total-container">
                    <SummaryRow title="TOTAL SPENT (Current Month)" value={monthlyBudgetSummaryData.totalMonthlyExpenses} valueClassName="text-red-700 font-extrabold text-lg" />
                    <SummaryRow title="TOTAL REMAINING (Budget - Actual)" value={monthlyBudgetSummaryData.monthlyRemainingBudget} valueClassName={`font-extrabold text-lg ${monthlyBudgetSummaryData.monthlyRemainingBudget >= 0 ? 'text-green-700' : 'text-red-700'}`} />
                </div>
            </div>

            </div>
        </div>
    );
}

export default MonthlyBudgetGrid;