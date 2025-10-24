// const CATEGORIES = ['Food & Drink', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Salary', 'Other'];
const CATEGORIES = [
  {id: '68eb6e29ed4af858c8669d0b', categoryName: 'Food & Drink'},
  {id: '68eb6e29ed4af858c8669d0b', categoryName: 'Housing'},
  {id: '68eb6e29ed4af858c8669d0b', categoryName: 'Transportation'},
  {id: '68eb6e29ed4af858c8669d0b', categoryName: 'Entertainment'},
  {id: '68eb6e29ed4af858c8669d0b', categoryName: 'Utilities'},
  {id: '68eb6e29ed4af858c8669d0b', categoryName: 'Salary'},
  {id: '68eb6e29ed4af858c8669d0b', categoryName: 'Other'}
];
const MOCK_BUDGET_DATA = [
  { categoryName: 'Housing', subCategory: 'Rental', recurringItemName: 'Rental', plannedBudget: 2100.00, runningAmountByPeriod: { '202510': 2100.00, '202511': 0, '202512': 0 } },
  { categoryName: 'Housing', subCategory: 'Utility', recurringItemName: 'Electricity', plannedBudget: 250.00, runningAmountByPeriod: { '202510': 206.40, '202511': 0, '202512': 0 } },
  { categoryName: 'Housing', subCategory: 'Utility', recurringItemName: 'Internet', plannedBudget: 105.00, runningAmountByPeriod: { '202510': 104.94, '202511': 0, '202512': 0 } },
  { categoryName: 'Transportation', subCategory: 'Car Loan', recurringItemName: 'Grom', plannedBudget: 695.00, runningAmountByPeriod: { '202510': 695.00, '202511': 0, '202512': 0 } },
  { categoryName: 'Salary', subCategory: 'Income', recurringItemName: 'Monthly Salary', plannedBudget: 5500.00, runningAmountByPeriod: { '202510': 5500.00, '202511': 0, '202512': 0 } },
  { categoryName: 'Other', subCategory: 'Unplanned', recurringItemName: 'Unplanned Expenses', plannedBudget: 0.00, runningAmountByPeriod: { '202510': 1761.00, '202511': 0, '202512': 0 } },
];
const BUDGET_MONTHS = ['202501', '202502', '202503', '202504', '202505', '202506', '202507', '202508', '202509', '202510', '202511', '202512'];
// const BUDGET_MONTHS = ['202505', '202506', '202507', '202508', '202509', '202510', '202511', '202512'];
// const BUDGET_MONTHS = ['202510', '202511', '202512'];
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