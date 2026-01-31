const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const getRangeOfActiveMonths = () => {
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();

  if(currentDate.getDate() > 27)
  {
      currentDate.setMonth(currentMonth + 1);
      currentMonth = currentDate.getMonth();
  }

  let lastMonthDate = currentDate;
  lastMonthDate.setMonth(currentMonth - 1);
  let currentYear = currentDate.getFullYear();

  let lastMonthYear = lastMonthDate.getFullYear();
  let lastMonthMonth = (lastMonthDate.getMonth());

  let monthsRange = [];
  monthsRange.push(((currentYear * 100) + (currentMonth)).toString());
  monthsRange.push(((lastMonthYear * 100) + (lastMonthMonth)).toString());

  return monthsRange;
};

export {
    formatCurrency,
    getRangeOfActiveMonths
}