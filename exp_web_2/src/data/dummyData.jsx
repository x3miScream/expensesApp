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

export {
    CATEGORIES,
    MOCK_BUDGET_DATA,
    MOCK_TRANSACTIONS,
    BUDGET_MONTHS
}