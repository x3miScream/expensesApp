import React from 'react';
import {formatCurrency} from '../../Utils/Utils.jsx';

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

  export default SummaryRow;