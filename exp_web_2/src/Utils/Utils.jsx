const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const getRangeOfActiveMonths = () => {
  const currentDate = new Date();
  const lastMonthDate = new Date(new Date().setMonth(-1))
  const currentYear = currentDate.getFullYear()
  const currentMonth = (currentDate.getMonth() + 1)
  const lastMonthYear = lastMonthDate.getFullYear()
  const lastMonthMonth = (lastMonthDate.getMonth() + 1)

  let monthsRange = [];
  monthsRange.push(((currentYear * 100) + (currentMonth)).toString())
  monthsRange.push(((lastMonthYear * 100) + (lastMonthMonth)).toString())

  return monthsRange;
};

export {
    formatCurrency,
    getRangeOfActiveMonths
}