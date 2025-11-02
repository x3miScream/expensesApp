import React, {useState, useEffect} from 'react';
import { BarChart2, Calendar, Clock } from 'lucide-react';
import {formatCurrency} from '../../Utils/Utils.jsx';

import useGetMonthlyBudget from '../../Hooks/useGetMonthlyBudget.jsx';

const OverallBalanceSection = () => {
    
    const [monthlyBudgetSummaryData, setMonthlyBudgetSummaryData] = useState({});
    const {getMonthlyBudgetDetails, getMonthlyBudgetSummary} = useGetMonthlyBudget();

    useEffect(() => {
        getMonthlyBudgetSummary(setMonthlyBudgetSummaryData);
    }, []);

    return(
    <div className="balance-section">
        <div className="balance-header">
            <div>
                <p className="balance-title">Expenses Up To Date</p>
                <h2 className={`balance-amount ${(Math.abs(monthlyBudgetSummaryData?.totalRunningExpenses) > monthlyBudgetSummaryData?.totalRunningExpensesExpected ? ' text-red-300' : '')}`}>
                    {formatCurrency(Math.abs(monthlyBudgetSummaryData?.totalRunningExpenses))} / {formatCurrency(monthlyBudgetSummaryData?.totalRunningExpensesExpected)}
                </h2>

                <h2 className={`balance-amount text-s ${(Math.abs(monthlyBudgetSummaryData?.totalRunningExpensesOverall) > monthlyBudgetSummaryData?.totalRunningExpensesExpectedOverall ? ' text-red-300' : '')}`}>
                    {formatCurrency(Math.abs(monthlyBudgetSummaryData?.totalRunningExpensesOverall))} / {formatCurrency(monthlyBudgetSummaryData?.totalRunningExpensesExpectedOverall)}
                </h2>
            </div>
        </div>

        {/* Time-Based Balances (Daily, Weekly, Monthly) */}
        <div className="metric-grid">
            {[
                { title: 'Daily Net', reamining: monthlyBudgetSummaryData?.dailyRemainingBudget, planned: monthlyBudgetSummaryData?.totalDailyBudget, expenses: Math.abs(monthlyBudgetSummaryData?.totalDailyExpenses), icon: Calendar },
                { title: 'Weekly Net', reamining: monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyRemainingBudget, planned: monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyPlannedBudget, expenses: Math.abs(monthlyBudgetSummaryData?.currentWeeklyRemainingBudget?.weeklyTotalExpenses), icon: Clock },
                { title: 'Monthlply Net', reamining: monthlyBudgetSummaryData?.monthlyRemainingBudget, planned: monthlyBudgetSummaryData?.totalMonthlyBudget, expenses: Math.abs(monthlyBudgetSummaryData?.totalMonthlyExpenses), icon: BarChart2 },
            ].map((metric) => {
                const isPositive = metric.reamining >= 0;
                return (
                    <div key={metric.title} className="metric-item">
                        <div>
                            <p className="metric-title">{metric.title}</p>
                            <p className={`metric-value ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                                {formatCurrency(metric.reamining)}
                            </p>
                            <p className='text-s'>[{metric.expenses} / {metric.planned}]</p>
                        </div>
                        <metric.icon className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem', color: '#93c5fd', opacity: 0.6 }} />
                    </div>
                );
            })}
        </div>
    </div>
)};

export default OverallBalanceSection;