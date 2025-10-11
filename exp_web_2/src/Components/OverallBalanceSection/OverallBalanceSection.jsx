import React from 'react';
import { BarChart2, Calendar, Clock } from 'lucide-react';
import {formatCurrency} from '../../Utils/Utils.jsx';

const OverallBalanceSection = ({ total, daily, weekly, monthly }) => (
    <div className="balance-section">
        <div className="balance-header">
            <div>
                <p className="balance-title">Overall Net Balance</p>
                <h2 className="balance-amount">
                    {formatCurrency(total)}
                </h2>
            </div>
        </div>

        {/* Time-Based Balances (Daily, Weekly, Monthly) */}
        <div className="metric-grid">
            {[
                { title: 'Daily Net', value: daily, icon: Calendar },
                { title: '7-Day Net', value: weekly, icon: Clock },
                { title: 'Monthly Net', value: monthly, icon: BarChart2 },
            ].map((metric) => {
                const isPositive = metric.value >= 0;
                return (
                    <div key={metric.title} className="metric-item">
                        <div>
                            <p className="metric-title">{metric.title}</p>
                            <p className={`metric-value ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                                {formatCurrency(metric.value)}
                            </p>
                        </div>
                        <metric.icon className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem', color: '#93c5fd', opacity: 0.6 }} />
                    </div>
                );
            })}
        </div>
    </div>
);

export default OverallBalanceSection;