using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Controllers.Base;
using Server.Data;
using Server.Dto;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionController : ApiBaseController
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<Transaction> _transactionCollection;
        private readonly IMongoCollection<Category> _categoryCollection;
        private readonly IMongoCollection<RecurringItem> _recurringItemCollection;
        public TransactionController(MongoDBService mongoDBService, IHttpContextAccessor httpContextAccessor)
            : base(httpContextAccessor)
        {
            _mongoDBService = mongoDBService;
            _transactionCollection = _mongoDBService._MongoDatabase.GetCollection<Transaction>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Transaction>());
            _categoryCollection = _mongoDBService._MongoDatabase.GetCollection<Category>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>());
            _recurringItemCollection = _mongoDBService._MongoDatabase.GetCollection<RecurringItem>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<RecurringItem>());
        }





        private async Task<bool> DefaultTransactionWithEmptyRecurringItemToDailyExpense(Transaction transaction)
        {
            if (string.IsNullOrEmpty(transaction.RecurringItemId))
            {
                var recurringTransactionDailyExpense = await _recurringItemCollection.Find(Builders<RecurringItem>.Filter.Eq(x => x.RecurringItemCode, Constants.RECURRINGITEM_CODE_DAILYEXPENSE)).FirstOrDefaultAsync();

                if (recurringTransactionDailyExpense == null)
                    return false;

                if (recurringTransactionDailyExpense != null)
                {
                    transaction.RecurringItemId = recurringTransactionDailyExpense.Id;
                }
            }

            return true;
        }





        [HttpGet]
        public async Task<IActionResult> Get()
        {
            List<TransactionReadDto> transactionsDto = new List<TransactionReadDto>();

            List<Category> categories = await _categoryCollection.Find(FilterDefinition<Category>.Empty).ToListAsync();

            List<Transaction> transactions = await _transactionCollection.Find(FilterDefinition<Transaction>.Empty).ToListAsync();

            transactionsDto = transactions.Join(categories,
                                outer => outer.CategoryId,
                                inner => inner.Id,
                                (outer, inner) => new TransactionReadDto()
                                {
                                    Id = outer.Id,
                                    Name = outer.Description,
                                    DateVal = outer.TransactionDateTime,
                                    Date = outer.TransactionDateTime.ToString("yyyy MMM dd"),
                                    Timestamp = outer.TransactionDateTime.ToString("yyyy MMM dd"),
                                    Amount = outer.Amount,
                                    TransactionType = outer.TransactionType,
                                    CategoryId = outer.CategoryId,
                                    CategoryData = inner,
                                    Category = inner.CategoryName,
                                    RecurringItemId = outer.RecurringItemId ?? string.Empty
                                }
                ).OrderByDescending(x => x.DateVal).ToList();

            return Ok(transactionsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var queryFilter = Builders<Transaction>.Filter.Eq(x => x.Id, id);
            var transaction = await _transactionCollection.Find(queryFilter).FirstOrDefaultAsync();

            return transaction is not null ? Ok(transaction) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Transaction transaction)
        {
            var categoryExists = await _categoryCollection.Find(Builders<Category>.Filter.Eq(x => x.Id, transaction.CategoryId)).AnyAsync();
            if (!categoryExists)
            {
                return BadRequest($"Category with ID {transaction.CategoryId} does not exist.");
            }

            await DefaultTransactionWithEmptyRecurringItemToDailyExpense(transaction);

            UpdateUserEntityBaseFields(transaction, true);

            await _transactionCollection.InsertOneAsync(transaction);
            return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
        }


        [HttpPut]
        public async Task<ActionResult> Put([FromBody] Transaction transaction)
        {
            await DefaultTransactionWithEmptyRecurringItemToDailyExpense(transaction);


            var queryFilter = Builders<Transaction>.Filter.Eq(x => x.Id, transaction.Id);

            UpdateUserEntityBaseFields(transaction, false);

            var updateDefinition = Builders<Transaction>.Update
                .Set(x => x.Description, transaction.Description)
                .Set(x => x.TransactionDateTime, transaction.TransactionDateTime)
                .Set(x => x.Amount, transaction.Amount)
                .Set(x => x.CategoryId, transaction.CategoryId)
                .Set(x => x.RecurringItemId, transaction.RecurringItemId)
                .Set(x => x.UpdatedBy, transaction.UpdatedBy)
                .Set(x => x.UpdatedAt, transaction.UpdatedAt);

            var updateResult = await _transactionCollection.UpdateOneAsync(queryFilter, updateDefinition);


            //await _categoryCollection.ReplaceOneAsync(queryFilter, category);

            return Ok();
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            var queryFilter = Builders<Transaction>.Filter.Eq(x => x.Id, id);
            var deleteResult = await _transactionCollection.DeleteOneAsync(queryFilter);
            if (deleteResult.DeletedCount > 0)
            {
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
    }
}
