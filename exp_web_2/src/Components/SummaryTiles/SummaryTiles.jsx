import React, {useMemo} from 'react';
import { DollarSign, Tag, Trash2 } from 'lucide-react';

import {formatCurrency} from '../../Utils/Utils.jsx';

import { CATEGORIES, MOCK_BUDGET_DATA, MOCK_TRANSACTIONS, BUDGET_MONTHS } from '../../data/dummyData.jsx';



const SummaryTiles = ({categories=[], expenses=[]}) => {
    const totalPositive = useMemo(() => {
        return expenses.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0);
      }, [expenses]);
    
      const totalNegative = useMemo(() => {
        return expenses.filter(e => e.amount < 0).reduce((sum, e) => sum + e.amount, 0);
      }, [expenses]);


    return (<div className="summary-tiles-grid">
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
          <p className="tile-value text-indigo-600">{categories.length}</p>
        </div>
        <div className="tile-icon-bg bg-indigo-100">
          <Tag className="w-5 h-5 text-indigo-600" style={{ width: '1.25rem', height: '1.25rem' }} />
        </div>
      </div>
    </div>
  )};

  export default SummaryTiles;