const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const getRangeOfActiveMonths = () => {
  let currentYear = new Date().getFullYear();
  let lastMonthYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let lastMonthMonth = new Date().getMonth();
  let currentDate = new Date().getDate();

  lastMonthMonth -= 1;

  if(currentDate > 27)
  {
      currentDate = 1;
      currentMonth += 1;
      lastMonthMonth += 1;
  }

  if(currentMonth > 11)
  {
      currentMonth = 0;
      currentYear += 1;
  }

  if(lastMonthMonth > 11)
  {
      lastMonthMonth = 0;
      lastMonthYear += 1;
  }
  else if(lastMonthMonth < 0)
  {
      lastMonthMonth = 0;
      lastMonthYear -= 1;
  }

  let monthsRange = [];
  monthsRange.push(((currentYear * 100) + (currentMonth + 1)).toString());
  monthsRange.push(((lastMonthYear * 100) + (lastMonthMonth + 1)).toString());

  return monthsRange;
};

export {
    formatCurrency,
    getRangeOfActiveMonths
}