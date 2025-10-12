import React, {useMemo} from 'react';
import {formatCurrency} from '../../Utils/Utils.jsx';
import SummaryRow from './SummaryRow.jsx';

import './MonthlyBudgetGrid.css';

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
}

export default MonthlyBudgetGrid;