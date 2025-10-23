using MongoDB.Bson;
using MongoDB.Driver;
using Server.Entities;
using Server.Utils;

namespace Server.Data
{
    public class MongoDbSeeder
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<RecurringItem> _recurringItemCollection;
        private readonly IMongoCollection<Category> _categoryCollection;
        private readonly IMongoCollection<MonthlyBudget> _monthlyBudgetCollection;
        private readonly IMongoCollection<MonthlyBudgetSetupItem> _monthlyBudgetSetupItemCollection;

        public MongoDbSeeder(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;

            _recurringItemCollection = _mongoDBService._MongoDatabase.GetCollection<RecurringItem>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<RecurringItem>());
            _categoryCollection = _mongoDBService._MongoDatabase.GetCollection<Category>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>());
            _monthlyBudgetCollection = _mongoDBService._MongoDatabase.GetCollection<MonthlyBudget>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<MonthlyBudget>());
            _monthlyBudgetSetupItemCollection = _mongoDBService._MongoDatabase.GetCollection<MonthlyBudgetSetupItem>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<MonthlyBudgetSetupItem>());
        }

        public async Task SeedDataAsync()
        {
            await SeedCategoryDataAsync();
            await SeedRecurringItemDataAsync();
            await SeedMonthlyBudgetDataAsync();
            await SeedMonthlyBudgetSetupItemsDataAsync();
        }

        public async Task SeedCategoryDataAsync()
        {
            var dataToSeed = new List<Category>()
            {
                new Category(){ CategoryCode = Constants.CATEGORY_CODE_HOUSING, CategoryName = "Housing" },
                new Category(){ CategoryCode = Constants.CATEGORY_CODE_TRANSPORT, CategoryName = "Transport" },
                new Category(){ CategoryCode = Constants.CATEGORY_CODE_OTHERS, CategoryName = "Others" },
                new Category(){ CategoryCode = Constants.CATEGORY_CODE_BABIES, CategoryName = "Babies" },
                new Category(){ CategoryCode = Constants.CATEGORY_CODE_ENTERTAINMENT, CategoryName = "Entertainment" },
                new Category(){ CategoryCode = Constants.CATEGORY_CODE_SYSTEM, CategoryName = "System" }
            };

            dataToSeed.ForEach(async (category) => {
                var queryFilter = Builders<Category>.Filter.Eq(x => x.CategoryCode, category.CategoryCode);
                var dbItem = await _categoryCollection.Find(queryFilter).FirstOrDefaultAsync();

                if (dbItem == null)
                {
                    await _categoryCollection.InsertOneAsync(category);
                }
            });
        }

        public async Task SeedRecurringItemDataAsync()
        {
            var categories = await _categoryCollection.Find(FilterDefinition<Category>.Empty).ToListAsync();

            var dataToSeed = new List<RecurringItem>
            {
                new RecurringItem { RecurringItemCode = "RENT", RecurringItemName = "Rental", Description = "Rental", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_HOUSING).Id },
                new RecurringItem { RecurringItemCode = "ELECTRICITY", RecurringItemName = "Electricity", Description = "Electricity", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_HOUSING).Id },
                new RecurringItem { RecurringItemCode = "WATER", RecurringItemName = "WATER", Description = "WATER", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_HOUSING).Id },
                new RecurringItem { RecurringItemCode = "INTERNET", RecurringItemName = "INTERNET", Description = "INTERNET", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_HOUSING).Id },

                new RecurringItem { RecurringItemCode = "CARLOAN", RecurringItemName = "Grom", Description = "Grom", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_TRANSPORT).Id },
                new RecurringItem { RecurringItemCode = "LRT", RecurringItemName = "LRT", Description = "LRT", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_TRANSPORT).Id },
                new RecurringItem { RecurringItemCode = "PETROL", RecurringItemName = "Petrol", Description = "Petrol", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_TRANSPORT).Id },

                new RecurringItem { RecurringItemCode = "ESSENTIAL", RecurringItemName = "Food & Essentials", Description = "Food & Essentials", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_BABIES).Id },

                new RecurringItem { RecurringItemCode = "TV", RecurringItemName = "Netflix", Description = "Netflix", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_ENTERTAINMENT).Id },
                new RecurringItem { RecurringItemCode = "MOBILE", RecurringItemName = "Mobile Internet", Description = "Mobile Internet", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_ENTERTAINMENT).Id },
                new RecurringItem { RecurringItemCode = "YOUTUBE", RecurringItemName = "Youtube", Description = "Youtube", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_ENTERTAINMENT).Id },

                new RecurringItem { RecurringItemCode = "DAYEXP", RecurringItemName = "Daily Expenses", Description = "Daily Expenses", CategoryId = categories.FirstOrDefault(x => x.CategoryCode == Constants.CATEGORY_CODE_SYSTEM).Id }
            };

            dataToSeed.ForEach(async (item) => {
                var queryFilter = Builders<RecurringItem>.Filter.Eq(x => x.RecurringItemCode, item.RecurringItemCode);
                var dbItem = await _recurringItemCollection.Find(queryFilter).FirstOrDefaultAsync();

                if(dbItem == null)
                {
                    await _recurringItemCollection.InsertOneAsync(item);
                }
            });
        }






        public async Task SeedMonthlyBudgetDataAsync()
        {
            var dataToSeed = new List<MonthlyBudget>()
            {
                new MonthlyBudget(){ BudgetCode = "DEFAULT", BudgetName = "Default Budget" }

            };

            dataToSeed.ForEach(async (budget) => {
                var queryFilter = Builders<MonthlyBudget>.Filter.Eq(x => x.BudgetCode, budget.BudgetCode);
                var dbItem = await _monthlyBudgetCollection.Find(queryFilter).FirstOrDefaultAsync();

                if (dbItem == null)
                {
                    await _monthlyBudgetCollection.InsertOneAsync(budget);
                }
            });
        }






        public async Task SeedMonthlyBudgetSetupItemsDataAsync()
        {
            var defaultBudget = await _monthlyBudgetCollection.Find(Builders<MonthlyBudget>.Filter.Eq(x => x.BudgetCode, "DEFAULT")).FirstOrDefaultAsync();
            var recurringItems = await _recurringItemCollection.Find(FilterDefinition<RecurringItem>.Empty).ToListAsync();

            var rentalRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "RENT");
            var electricityRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "ELECTRICITY");
            var waterRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "WATER");
            var internetRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "INTERNET");
            var carLoanRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "CARLOAN");
            var lrtRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "LRT");
            var petrolRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "PETROL");
            var essentialRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "ESSENTIAL");
            var tvRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "TV");
            var mobileRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "MOBILE");
            var youtubeRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "YOUTUBE");
            var dayExpRecItem = recurringItems.FirstOrDefault(x => x.RecurringItemCode == "DAYEXP");

            if (defaultBudget != null)
            {
                var defaultBudgetId = defaultBudget.Id;

                var dataToSeed = new List<MonthlyBudgetSetupItem>()
                {
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = rentalRecItem.Id, PlannedBudget = 2_100, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = electricityRecItem.Id, PlannedBudget = 250, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = waterRecItem.Id, PlannedBudget = 20, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = internetRecItem.Id, PlannedBudget = 105, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = carLoanRecItem.Id, PlannedBudget = 695, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = lrtRecItem.Id, PlannedBudget = 165, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = petrolRecItem.Id, PlannedBudget = 150, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = essentialRecItem.Id, PlannedBudget = 800, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = tvRecItem.Id, PlannedBudget = 28, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = mobileRecItem.Id, PlannedBudget = 50, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = youtubeRecItem.Id, PlannedBudget = 20.9M, Adjustment = 0 },
                    new MonthlyBudgetSetupItem(){ MonthlyBudgetId = defaultBudgetId, RecurringItemId = dayExpRecItem.Id, PlannedBudget = 0, Adjustment = 0 },

                };

                dataToSeed.ForEach(async (item) =>
                {
                    var filterBuilder = Builders<MonthlyBudgetSetupItem>.Filter;
                    var queryFilter = filterBuilder.Eq(x => x.MonthlyBudgetId, defaultBudget.Id)
                        & filterBuilder.Eq(x => x.RecurringItemId, item.RecurringItemId);

                    var dbItem = await _monthlyBudgetSetupItemCollection.Find(queryFilter).FirstOrDefaultAsync();

                    if (dbItem == null)
                    {
                        await _monthlyBudgetSetupItemCollection.InsertOneAsync(item);
                    }
                });
            }
        }
    }
}
