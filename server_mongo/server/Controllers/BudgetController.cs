using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Controllers.Base;
using Server.Data;
using Server.Dto;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [Route("api/budgets")]
    [ApiController]
    public class BudgetController: ApiBaseController
    {
        private readonly MongoDBService _mongoDBService;

        private readonly IMongoCollection<Category>? _categoryCollection;
        private readonly IMongoCollection<RecurringItem>? _recurringItemCollection;
        private readonly IMongoCollection<Transaction>? _transactionCollection;

        private readonly IMongoCollection<MonthlyBudget>? _monthlyBudgetCollection;
        private readonly IMongoCollection<MonthlyBudgetSetupItem>? _monthlyBudgetSetupItemCollection;
        private readonly IMongoCollection<MonthlyBudgetByPeriod>? _monthlyBudgetByPeriodCollection;
        private readonly IMongoCollection<MonthlyBudgetByPeriodItem>? _monthlyBudgetByPeriodItemCollection;

        public BudgetController(MongoDBService mongoDBService, IHttpContextAccessor httpContextAccessor)
            : base(httpContextAccessor)
        {
            _mongoDBService = mongoDBService;

            _categoryCollection = _mongoDBService._MongoDatabase.GetCollection<Category>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>());
            _recurringItemCollection = _mongoDBService._MongoDatabase.GetCollection<RecurringItem>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<RecurringItem>());
            _transactionCollection = _mongoDBService._MongoDatabase.GetCollection<Transaction>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Transaction>());

            _monthlyBudgetCollection = _mongoDBService._MongoDatabase.GetCollection<MonthlyBudget>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<MonthlyBudget>());
            _monthlyBudgetSetupItemCollection = _mongoDBService._MongoDatabase.GetCollection<MonthlyBudgetSetupItem>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<MonthlyBudgetSetupItem>());
            _monthlyBudgetByPeriodCollection = _mongoDBService._MongoDatabase.GetCollection<MonthlyBudgetByPeriod>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<MonthlyBudgetByPeriod>());
            _monthlyBudgetByPeriodItemCollection = _mongoDBService._MongoDatabase.GetCollection<MonthlyBudgetByPeriodItem>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<MonthlyBudgetByPeriodItem>());
        }




        private async Task<bool> CreateMonthlyBudgetByPeriodIfNotExists(string monthlyBudgetId, int period)
        {
            var queryFilter = Builders<MonthlyBudgetByPeriod>.Filter.And(
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudgetId),
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.Period, period)
            );
            
            var existingRecord = _monthlyBudgetByPeriodCollection.Find(ApplyUserFilter(queryFilter)).FirstOrDefault();

            if(existingRecord == null)
            {
                var newRecord = new MonthlyBudgetByPeriod
                {
                    MonthlyBudgetId = monthlyBudgetId,
                    Period = period,
                    PlannedMonthlyBudget = Constants.MONTHLY_BUDGET_PLANNED,
                    BudgetAdjustment = 0m
                };

                ApplyUserBaseFieldUpdate(newRecord, isNew: true);

                await _monthlyBudgetByPeriodCollection.InsertOneAsync(newRecord);

                await CreateMonthlyBudgetByPeriodItems(monthlyBudgetId, newRecord.Id);

                return true;
            }
            return false;
        }




        private async Task<bool> CreateMonthlyBudgetByPeriodItems(string monthlyBudgetId, string monthlyBudgetByPeriodId)
        {
            var queryFilter = Builders<MonthlyBudgetSetupItem>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudgetId);
            var setupItems = await _monthlyBudgetSetupItemCollection.Find(ApplyUserFilter(queryFilter)).ToListAsync();

            if(setupItems.Any())
            {
                List<MonthlyBudgetByPeriodItem> newItems = new List<MonthlyBudgetByPeriodItem>();

                for (int i=0;i< setupItems.Count;i++)
                {
                    if (!(await _monthlyBudgetByPeriodItemCollection.Find(ApplyUserFilter(Builders<MonthlyBudgetByPeriodItem>.Filter.And(
                        Builders<MonthlyBudgetByPeriodItem>.Filter.Eq(x => x.MonthlyBudgetByPeriodId, monthlyBudgetByPeriodId),
                        Builders<MonthlyBudgetByPeriodItem>.Filter.Eq(x => x.RecurringItemId, setupItems[i].RecurringItemId)
                        ))).AnyAsync()))
                    {
                        var newRecord = new MonthlyBudgetByPeriodItem
                        {
                            MonthlyBudgetByPeriodId = monthlyBudgetByPeriodId,
                            RecurringItemId = setupItems[i].RecurringItemId,
                            CurrentRunningAmount = 0
                        };

                        ApplyUserBaseFieldUpdate(newRecord, isNew: true);
                        newItems.Add(newRecord);
                    }
                }

                await _monthlyBudgetByPeriodItemCollection.InsertManyAsync(newItems);

                return true;
            }

            return false;
        }



        private List<MonthlyBudgetByPeriodWeeklySummaryDto> GenerateBlankWeeklyBudgetSummary()
        {
            int totalDaysInAWeek = 0;
            int period = PeriodUtils.GetCurrentPeriod();
            DateTime periodStartDate = PeriodUtils.GetPeriodStartDate(period);
            DateTime periodEndDate = PeriodUtils.GetPeriodEndDate(period);

            DayOfWeek startDayOfWeek = periodStartDate.DayOfWeek;
            DayOfWeek endDayOfWeek = periodEndDate.DayOfWeek;

            DateTime weekRunningDate = periodStartDate;

            List<MonthlyBudgetByPeriodWeeklySummaryDto> monthlyBudgetByPeriodWeeklySummaryDtos = new List<MonthlyBudgetByPeriodWeeklySummaryDto>();
            MonthlyBudgetByPeriodWeeklySummaryDto weeklySummary = new MonthlyBudgetByPeriodWeeklySummaryDto()
            {
                WeekStartDate = periodStartDate
            };

            while (weekRunningDate <= periodEndDate)
            {
                startDayOfWeek = weekRunningDate.DayOfWeek;

                if (startDayOfWeek == DayOfWeek.Monday)
                {
                    weeklySummary = new MonthlyBudgetByPeriodWeeklySummaryDto()
                    {
                        WeekStartDate = weekRunningDate
                    };

                    totalDaysInAWeek = 0;
                }

                totalDaysInAWeek++;


                if (startDayOfWeek == DayOfWeek.Sunday)
                {
                    weeklySummary.WeekEndDate = new DateTime(weekRunningDate.Year, weekRunningDate.Month, weekRunningDate.Day, 23, 59, 59);
                    weeklySummary.WeekNumber = (monthlyBudgetByPeriodWeeklySummaryDtos.Count + 1);
                    weeklySummary.TotalDaysInWeek = totalDaysInAWeek;

                    weeklySummary.IsCurrentWeek = (weeklySummary.WeekStartDate <= DateTime.Now && weeklySummary.WeekEndDate >= DateTime.Now);

                    monthlyBudgetByPeriodWeeklySummaryDtos.Add(weeklySummary);
                }


                weekRunningDate = weekRunningDate.AddDays(1);
            }

            if (startDayOfWeek != DayOfWeek.Sunday)
            {
                weeklySummary.WeekEndDate = new DateTime(weekRunningDate.Year, weekRunningDate.Month, weekRunningDate.Day, 23, 59, 59);
                weeklySummary.WeekNumber = (monthlyBudgetByPeriodWeeklySummaryDtos.Count + 1);
                weeklySummary.TotalDaysInWeek = totalDaysInAWeek;

                weeklySummary.IsCurrentWeek = (weeklySummary.WeekStartDate <= DateTime.Now && weeklySummary.WeekEndDate >= DateTime.Now);

                monthlyBudgetByPeriodWeeklySummaryDtos.Add(weeklySummary);
            }

            return monthlyBudgetByPeriodWeeklySummaryDtos;
        }


        private async Task ApplyTransactionsToWeeklyBudgetSummary(MonthlyBudgetByPeriodSummaryDto result, List<MonthlyBudgetSetupItem> monthlyBudgetSetupItems)
        {
            result.WeeklyRemainingBudget = GenerateBlankWeeklyBudgetSummary();

            var recurringItemsAll = await _recurringItemCollection.Find(ApplyUserFilter(Builders<RecurringItem>.Filter.Empty)).ToListAsync();

            var recurringItewmDailyExpense = recurringItemsAll.FirstOrDefault(x => x.RecurringItemCode == Constants.RECURRINGITEM_CODE_DAILYEXPENSE);
            var recurringItewmMonthlyExpense = recurringItemsAll.FirstOrDefault(x => x.RecurringItemCode == Constants.RECURRINGITEM_CODE_MONTHLYEXPENSE);

            int period = PeriodUtils.GetCurrentPeriod();
            DateTime periodStartDate = PeriodUtils.GetPeriodStartDate(period);
            DateTime periodEndDate = PeriodUtils.GetPeriodEndDate(period);

            var transactions = await _transactionCollection.Find(ApplyUserFilter(Builders<Transaction>.Filter.And(
                Builders<Transaction>.Filter.Gte(x => x.TransactionDateTime, periodStartDate),
                Builders<Transaction>.Filter.Lte(x => x.TransactionDateTime, periodEndDate)
                ))).ToListAsync();

            var transactionsUpToDate = transactions.Where(x => x.TransactionDateTime.Date <= DateTime.Today).ToList();

            transactions = transactions.Where(x => (string.IsNullOrEmpty(x.RecurringItemId) || x.RecurringItemId == recurringItewmDailyExpense.Id)).ToList();

            for(int i=0;i< result.WeeklyRemainingBudget.Count;i++)
            {
                var weeklyTransactions = transactions.Where(x => x.TransactionDateTime >= result.WeeklyRemainingBudget[i].WeekStartDate
                    && x.TransactionDateTime <= result.WeeklyRemainingBudget[i].WeekEndDate).ToList();

                result.WeeklyRemainingBudget[i].WeeklyPlannedBudget = result.DailyRemainingBudget * result.WeeklyRemainingBudget[i].TotalDaysInWeek;
                result.WeeklyRemainingBudget[i].WeeklyRemainingBudget = result.WeeklyRemainingBudget[i].WeeklyPlannedBudget;
                result.WeeklyRemainingBudget[i].WeeklyTotalExpenses = weeklyTransactions.Sum(x => x.Amount);
                result.WeeklyRemainingBudget[i].WeeklyRemainingBudget += result.WeeklyRemainingBudget[i].WeeklyTotalExpenses;
                result.WeeklyRemainingBudget[i].WeeklyRemainingBudget = Decimal.Round(result.WeeklyRemainingBudget[i].WeeklyRemainingBudget, 2);
            }

            var transactionsToday = transactions.Where(x => x.TransactionDateTime.Date == DateTime.Today).ToList();

            result.TotalDailyExpenses += transactionsToday.Sum(x => x.Amount);
            result.DailyRemainingBudget += result.TotalDailyExpenses;

            result.TotalMonthlyExpenses = transactions.Sum(x => x.Amount);
            result.MonthlyRemainingBudget += result.TotalMonthlyExpenses;


            for (int i=0;i< monthlyBudgetSetupItems.Count;i++)
            {
                if (transactionsUpToDate.Any(x => x.RecurringItemId == monthlyBudgetSetupItems[i].RecurringItemId && (x.RecurringItemId != recurringItewmDailyExpense.Id && x.RecurringItemId != recurringItewmMonthlyExpense.Id)))
                {
                    result.TotalRunningExpensesOverall += transactionsUpToDate.Where(x => x.RecurringItemId == monthlyBudgetSetupItems[i].RecurringItemId).Sum(x => x.Amount);
                    result.TotalRunningExpensesExpectedOverall += monthlyBudgetSetupItems[i].PlannedBudget;
                }
            }
            
            result.TotalRunningExpensesExpectedOverall += (result.TotalDailyBudget * (int)((DateTime.Today - result.PeriodStartDate).TotalDays + 1));
            result.TotalRunningExpensesOverall += transactionsUpToDate.Where(x => string.IsNullOrEmpty(x.RecurringItemId) || x.RecurringItemId == recurringItewmDailyExpense.Id).Sum(x => x.Amount);

            result.TotalRunningExpensesExpected += (result.TotalDailyBudget * (int)((DateTime.Today - result.PeriodStartDate).TotalDays + 1));
            result.TotalRunningExpenses += transactionsUpToDate.Where(x => string.IsNullOrEmpty(x.RecurringItemId) || x.RecurringItemId == recurringItewmDailyExpense.Id).Sum(x => x.Amount);
        }


        private async Task<MonthlyBudgetByPeriodSummaryDto> GenerateMonthlyBudgetByPeriodSummaryDto(string budgetCode)
        {
            MonthlyBudgetByPeriodSummaryDto result = new MonthlyBudgetByPeriodSummaryDto();
            int currentPeriod = PeriodUtils.GetCurrentPeriod();


            var monthlyBudget = await _monthlyBudgetCollection.Find(ApplyUserFilter(Builders<MonthlyBudget>.Filter.Eq(x => x.BudgetCode, budgetCode))).FirstOrDefaultAsync();

            if (monthlyBudget == null)
                return result;

            var monthlyBudgetByPeriod = _monthlyBudgetByPeriodCollection.Find(ApplyUserFilter(Builders<MonthlyBudgetByPeriod>.Filter.And(
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id),
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.Period, currentPeriod)
                ))).FirstOrDefault();

            if (monthlyBudgetByPeriod == null)
                return result;

            var monthlyBudgetByPeriodItems = await _monthlyBudgetByPeriodItemCollection.Find(
                ApplyUserFilter(Builders<MonthlyBudgetByPeriodItem>.Filter.Eq(x => x.MonthlyBudgetByPeriodId, monthlyBudgetByPeriod.Id))
                ).ToListAsync();

            if (!monthlyBudgetByPeriodItems.Any())
                return result;


            var monthlyBudgetSetupitems = await _monthlyBudgetSetupItemCollection.Find(
                ApplyUserFilter(Builders<MonthlyBudgetSetupItem>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id))
                ).ToListAsync();

            if (!monthlyBudgetSetupitems.Any())
                return result;

            result.PeriodStartDate = PeriodUtils.GetPeriodStartDate(currentPeriod);
            result.PeriodEndDate = PeriodUtils.GetPeriodEndDate(currentPeriod);

            result.TotalDailyBudget = Decimal.Round(((monthlyBudgetByPeriod.PlannedMonthlyBudget - (monthlyBudgetSetupitems.Sum(x => x.PlannedBudget))) / 31), 2);
            result.DailyRemainingBudget = result.TotalDailyBudget;


            result.TotalMonthlyBudget = Decimal.Round((monthlyBudgetByPeriod.PlannedMonthlyBudget - (monthlyBudgetSetupitems.Sum(x => x.PlannedBudget))), 2);
            result.MonthlyRemainingBudget = result.TotalMonthlyBudget;


            await ApplyTransactionsToWeeklyBudgetSummary(result, monthlyBudgetSetupitems);

            result.CurrentWeeklyRemainingBudget = result.WeeklyRemainingBudget.FirstOrDefault(x => x.IsCurrentWeek) ?? new MonthlyBudgetByPeriodWeeklySummaryDto();

            return result;
        }



        private async Task<List<MonthlyBudgetByPeriodItemDto>> GenerateMonthlyBudgetByPeriodItemDtos(string budgetCode)
        {
            List<MonthlyBudgetByPeriodItemDto> result = new List<MonthlyBudgetByPeriodItemDto>();

            var categories = await _categoryCollection.Find(ApplyUserFilter(Builders<Category>.Filter.Empty)).ToListAsync();
            var recurringItems = await _recurringItemCollection.Find(ApplyUserFilter(Builders<RecurringItem>.Filter.Empty)).ToListAsync();

            int currentPeriod = PeriodUtils.GetCurrentPeriod();

            var monthlyBudget = await _monthlyBudgetCollection.Find(ApplyUserFilter(Builders<MonthlyBudget>.Filter.Eq(x => x.BudgetCode, budgetCode))).FirstOrDefaultAsync();

            if (monthlyBudget == null)
                return result;

            var monthlyBudgetByPeriod = _monthlyBudgetByPeriodCollection.Find(ApplyUserFilter(Builders<MonthlyBudgetByPeriod>.Filter.And(
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id),
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.Period, currentPeriod)
                ))).FirstOrDefault();

            if (monthlyBudgetByPeriod == null)
                return result;

            var monthlyBudgetByPeriodItems = await _monthlyBudgetByPeriodItemCollection.Find(
                ApplyUserFilter(Builders<MonthlyBudgetByPeriodItem>.Filter.Eq(x => x.MonthlyBudgetByPeriodId, monthlyBudgetByPeriod.Id))
                ).ToListAsync();

            if (!monthlyBudgetByPeriodItems.Any())
                return result;


            var monthlyBudgetSetupitems = await _monthlyBudgetSetupItemCollection.Find(
                ApplyUserFilter(Builders<MonthlyBudgetSetupItem>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id))
                ).ToListAsync();

            if (!monthlyBudgetSetupitems.Any())
                return result;


            for (int i = 0; i < monthlyBudgetByPeriodItems.Count; i++)
            {
                var recurringItem = recurringItems.FirstOrDefault(x => x.Id == monthlyBudgetByPeriodItems[i].RecurringItemId);

                if (recurringItem != null)
                {
                    var category = categories.FirstOrDefault(x => x.Id == recurringItem.CategoryId);
                    var budgetSetupItem = monthlyBudgetSetupitems.FirstOrDefault(x => x.RecurringItemId == monthlyBudgetByPeriodItems[i].RecurringItemId);

                    result.Add(new MonthlyBudgetByPeriodItemDto
                    {
                        MonthlyBudgetId = monthlyBudget.Id,
                        MonthlyBudgetByPeriodId = monthlyBudgetByPeriod.Id,
                        MonthlyBudgetByPeriodItemId = monthlyBudgetByPeriodItems[i].Id,
                        Period = monthlyBudgetByPeriod.Period,
                        RecurringItemId = monthlyBudgetByPeriodItems[i].RecurringItemId,
                        RecurringItemCode = recurringItem.RecurringItemCode ?? string.Empty,
                        RecurringItemName = recurringItem.RecurringItemName ?? string.Empty,
                        RecurringItemDescription = recurringItem.Description ?? string.Empty,
                        CategoryId = category?.Id ?? string.Empty,
                        CategoryCode = category?.CategoryCode ?? string.Empty,
                        CategoryName = category?.CategoryName ?? string.Empty,
                        PlannedBudget = monthlyBudgetSetupitems.FirstOrDefault(x => x.MonthlyBudgetId == monthlyBudget.Id && x.RecurringItemId == monthlyBudgetByPeriodItems[i].RecurringItemId)?.PlannedBudget ?? 0,
                    });

                    if (recurringItem.RecurringItemCode == Constants.RECURRINGITEM_CODE_MONTHLYEXPENSE)
                    {
                        result[(result.Count - 1)].PlannedBudget = (monthlyBudgetByPeriod.PlannedMonthlyBudget - (monthlyBudgetSetupitems.Sum(x => x.PlannedBudget)));
                        result[(result.Count - 1)].PlannedBudget = Decimal.Round(result[(result.Count - 1)].PlannedBudget, 2);
                    }

                    if (recurringItem.RecurringItemCode == Constants.RECURRINGITEM_CODE_DAILYEXPENSE)
                    {
                        result[(result.Count - 1)].PlannedBudget = (monthlyBudgetByPeriod.PlannedMonthlyBudget - (monthlyBudgetSetupitems.Sum(x => x.PlannedBudget))) / 31;
                        result[(result.Count - 1)].PlannedBudget = Decimal.Round(result[(result.Count - 1)].PlannedBudget, 2);
                    }
                }
                else
                {
                    await _monthlyBudgetByPeriodItemCollection.DeleteOneAsync(Builders<MonthlyBudgetByPeriodItem>.Filter.Eq(x => x.Id, monthlyBudgetByPeriodItems[i].RecurringItemId));
                }
            }

            await ApplyTransactionsToBudgetCalculation(result);

            return result;
        }


        private async Task ApplyTransactionsToBudgetCalculation(List<MonthlyBudgetByPeriodItemDto> budgetItems)
        {
            var transactions = await _transactionCollection.Find(ApplyUserFilter(Builders<Transaction>.Filter.Empty)).ToListAsync();

            var recurringItewmDailyExpense = await _recurringItemCollection.Find(ApplyUserFilter(Builders<RecurringItem>.Filter.Eq(x => x.RecurringItemCode, Constants.RECURRINGITEM_CODE_DAILYEXPENSE))).FirstOrDefaultAsync();
            var recurringItewmMonthlyExpense = await _recurringItemCollection.Find(ApplyUserFilter(Builders<RecurringItem>.Filter.Eq(x => x.RecurringItemCode, Constants.RECURRINGITEM_CODE_MONTHLYEXPENSE))).FirstOrDefaultAsync();

            if (transactions.Any())
            {
                budgetItems.ForEach((budgetItem) => {
                    var transactionsForRecurringItem = transactions.Where(x => x.RecurringItemId == budgetItem.RecurringItemId 
                        && x.TransactionDateTime >= PeriodUtils.GetPeriodStartDate(budgetItem.Period)
                        && x.TransactionDateTime <= PeriodUtils.GetPeriodEndDate(budgetItem.Period)).ToList();

                    switch (budgetItem.RecurringItemCode)
                    {
                        case Constants.RECURRINGITEM_CODE_MONTHLYEXPENSE:
                            transactionsForRecurringItem = transactions.Where(x => (string.IsNullOrEmpty(x.RecurringItemId) || x.RecurringItemId == recurringItewmDailyExpense.Id)
                            && x.TransactionDateTime >= PeriodUtils.GetPeriodStartDate(budgetItem.Period)
                            && x.TransactionDateTime <= PeriodUtils.GetPeriodEndDate(budgetItem.Period)).ToList();
                        break;
                        case Constants.RECURRINGITEM_CODE_DAILYEXPENSE:
                            transactionsForRecurringItem = transactions.Where(x => (string.IsNullOrEmpty(x.RecurringItemId) || x.RecurringItemId == recurringItewmDailyExpense.Id) && x.TransactionDateTime.Date == DateTime.Today).ToList();
                        break;
                    };

                    transactionsForRecurringItem.ForEach((transaction) => {
                        int transactionPeriod = PeriodUtils.GetPeriodFromDateTime(transaction.TransactionDateTime);

                        if(budgetItem.RunningAmountByPeriod.ContainsKey(transactionPeriod))
                        {
                            budgetItem.RunningAmountByPeriod[transactionPeriod] += transaction.Amount;
                        }
                        else
                        {
                            budgetItem.RunningAmountByPeriod[transactionPeriod] = transaction.Amount;
                        }
                    });

                    budgetItem.CurrentRunningAmount += transactions.Where(x => x.RecurringItemId == budgetItem.RecurringItemId).Sum(x => x.Amount);
                });
            }
        }



        [HttpGet]
        [Route("getCurrentPeriodBudget/{budgetCode}")]
        public async Task<ActionResult<List<MonthlyBudgetByPeriodItemDto>>> GetCurrentBudget(string budgetCode)
        {
            int currentPeriod = PeriodUtils.GetCurrentPeriod();

            var queryFilterBuilder = Builders<MonthlyBudget>.Filter;
            var monthlyBudget = await _monthlyBudgetCollection.Find(ApplyUserFilter(queryFilterBuilder.Eq(x => x.BudgetCode, budgetCode))).FirstOrDefaultAsync();

            if(monthlyBudget == null)
                return NotFound("Monthly Budget Not Found");

            var monthlyBudgetByPeriod = _monthlyBudgetByPeriodCollection.Find(ApplyUserFilter(Builders<MonthlyBudgetByPeriod>.Filter.And(
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id),
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.Period, currentPeriod)
            ))).FirstOrDefault();

            if(monthlyBudgetByPeriod == null)
            {
                await CreateMonthlyBudgetByPeriodIfNotExists(monthlyBudget.Id, currentPeriod);
            }


            var monthlyBudgetByPeriodItemDtos = await GenerateMonthlyBudgetByPeriodItemDtos(budgetCode);


            return Ok(monthlyBudgetByPeriodItemDtos);
        }



        [HttpGet]
        [Route("getCurrentPeriodBudgetSummary/{budgetCode}")]
        public async Task<ActionResult<MonthlyBudgetByPeriodSummaryDto>> GetCurrentPeriodBudgetSummary(string budgetCode)
        {
            var monthlyBudgetByPeriodItemDtos = await GenerateMonthlyBudgetByPeriodSummaryDto(budgetCode);

            return Ok(monthlyBudgetByPeriodItemDtos);
        }
    }
}
