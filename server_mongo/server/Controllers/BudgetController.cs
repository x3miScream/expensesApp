using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Data;
using Server.Dto;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [Route("api/budgets")]
    [ApiController]
    public class BudgetController: ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        private readonly IMongoCollection<Category>? _categoryCollection;
        private readonly IMongoCollection<RecurringItem>? _recurringItemCollection;
        private readonly IMongoCollection<Transaction>? _transactionCollection;

        private readonly IMongoCollection<MonthlyBudget>? _monthlyBudgetCollection;
        private readonly IMongoCollection<MonthlyBudgetSetupItem>? _monthlyBudgetSetupItemCollection;
        private readonly IMongoCollection<MonthlyBudgetByPeriod>? _monthlyBudgetByPeriodCollection;
        private readonly IMongoCollection<MonthlyBudgetByPeriodItem>? _monthlyBudgetByPeriodItemCollection;

        public BudgetController(MongoDBService mongoDBService)
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

            var existingRecord = _monthlyBudgetByPeriodCollection.Find(queryFilter).FirstOrDefault();

            if(existingRecord == null)
            {
                var newRecord = new MonthlyBudgetByPeriod
                {
                    MonthlyBudgetId = monthlyBudgetId,
                    Period = period
                };

                await _monthlyBudgetByPeriodCollection.InsertOneAsync(newRecord);

                await CreateMonthlyBudgetByPeriodItems(monthlyBudgetId, newRecord.Id);

                return true;
            }
            return false;
        }




        private async Task<bool> CreateMonthlyBudgetByPeriodItems(string monthlyBudgetId, string monthlyBudgetByPeriodId)
        {
            var queryFilter = Builders<MonthlyBudgetSetupItem>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudgetId);
            var setupItems = await _monthlyBudgetSetupItemCollection.Find(queryFilter).ToListAsync();

            if(setupItems.Any())
            {
                List<MonthlyBudgetByPeriodItem> newItems = new List<MonthlyBudgetByPeriodItem>();

                for (int i=0;i< setupItems.Count;i++)
                {
                    newItems.Add(new MonthlyBudgetByPeriodItem
                    {
                        MonthlyBudgetByPeriodId = monthlyBudgetByPeriodId,
                        RecurringItemId = setupItems[i].RecurringItemId,
                        CurrentRunningAmount = 0
                    });
                }

                await _monthlyBudgetByPeriodItemCollection.InsertManyAsync(newItems);

                return true;
            }

            return false;
        }





        private async Task<List<MonthlyBudgetByPeriodItemDto>> GenerateMonthlyBudgetByPeriodItemDtos(string budgetCode)
        {
            List<MonthlyBudgetByPeriodItemDto> result = new List<MonthlyBudgetByPeriodItemDto>();

            var categories = await _categoryCollection.Find(Builders<Category>.Filter.Empty).ToListAsync();
            var recurringItems = await _recurringItemCollection.Find(Builders<RecurringItem>.Filter.Empty).ToListAsync();

            int currentPeriod = PeriodUtils.GetCurrentPeriod();

            var monthlyBudget = await _monthlyBudgetCollection.Find(Builders<MonthlyBudget>.Filter.Eq(x => x.BudgetCode, budgetCode)).FirstOrDefaultAsync();

            if (monthlyBudget == null)
                return result;

            var monthlyBudgetByPeriod = _monthlyBudgetByPeriodCollection.Find(Builders<MonthlyBudgetByPeriod>.Filter.And(
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id),
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.Period, currentPeriod)
                )).FirstOrDefault();

            if (monthlyBudgetByPeriod == null)
                return result;

            var monthlyBudgetByPeriodItems = await _monthlyBudgetByPeriodItemCollection.Find(
                Builders<MonthlyBudgetByPeriodItem>.Filter.Eq(x => x.MonthlyBudgetByPeriodId, monthlyBudgetByPeriod.Id)
                ).ToListAsync();

            if (!monthlyBudgetByPeriodItems.Any())
                return result;


            var monthlyBudgetSetupitems = await _monthlyBudgetSetupItemCollection.Find(
                Builders<MonthlyBudgetSetupItem>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id)
                ).ToListAsync();

            if (!monthlyBudgetSetupitems.Any())
                return result;


            for (int i = 0; i < monthlyBudgetByPeriodItems.Count; i++)
            {
                var recurringItem = recurringItems.FirstOrDefault(x => x.Id == monthlyBudgetByPeriodItems[i].RecurringItemId);

                if (recurringItem != null)
                {
                    var category = categories.FirstOrDefault(x => x.Id == recurringItem.CategoryId);

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
                }
                else
                {
                    await _monthlyBudgetByPeriodItemCollection.DeleteOneAsync(Builders<MonthlyBudgetByPeriodItem>.Filter.Eq(x => x.Id, monthlyBudgetByPeriodItems[i].RecurringItemId));
                }

                await ApplyTransactionsToBudgetCalculation(result);
            }

            return result;
        }


        private async Task ApplyTransactionsToBudgetCalculation(List<MonthlyBudgetByPeriodItemDto> budgetItems)
        {
            var transactions = await _transactionCollection.Find(Builders<Transaction>.Filter.Empty).ToListAsync();

            if(transactions.Any())
            {
                budgetItems.ForEach((budgetItem) => {
                    var transactionsForRecurringItem = transactions.Where(x => x.RecurringItemId == budgetItem.RecurringItemId).ToList();

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
            var monthlyBudget = await _monthlyBudgetCollection.Find(queryFilterBuilder.Eq(x => x.BudgetCode, budgetCode)).FirstOrDefaultAsync();

            if(monthlyBudget == null)
                return NotFound("Monthly Budget Not Found");

            var monthlyBudgetByPeriod = _monthlyBudgetByPeriodCollection.Find(Builders<MonthlyBudgetByPeriod>.Filter.And(
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.MonthlyBudgetId, monthlyBudget.Id),
                Builders<MonthlyBudgetByPeriod>.Filter.Eq(x => x.Period, currentPeriod)
            )).FirstOrDefault();

            if(monthlyBudgetByPeriod == null)
            {
                await CreateMonthlyBudgetByPeriodIfNotExists(monthlyBudget.Id, currentPeriod);
            }


            var monthlyBudgetByPeriodItemDtos = await GenerateMonthlyBudgetByPeriodItemDtos(budgetCode);


            return Ok(monthlyBudgetByPeriodItemDtos);
        }
    }
}
