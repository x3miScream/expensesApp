using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Data;
using Server.Dto;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<Transaction> _transactions;
        private readonly IMongoCollection<Category> _categories;
        public TransactionController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
            _transactions = _mongoDBService._MongoDatabase.GetCollection<Transaction>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Transaction>());
            _categories = _mongoDBService._MongoDatabase.GetCollection<Category>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>());
        }

        [HttpGet]
        public async Task<IActionResult> Get(bool isIncludeForeignKeys = false)
        {
            List<TransactionReadDto> transactionsDto = new List<TransactionReadDto>();

            if (isIncludeForeignKeys)
            {
                List<Category> categories = await _categories.Find(FilterDefinition<Category>.Empty).ToListAsync();

                List<Transaction> transactions = await _transactions.Find(FilterDefinition<Transaction>.Empty).ToListAsync();

                transactionsDto = transactions.Join(categories,
                                    outer => outer.CategoryId,
                                    inner => inner.Id,
                                    (outer, inner) => new TransactionReadDto()
                                    {
                                        Id = outer.Id,
                                        Description = outer.Description,
                                        TransactionDateTime = outer.TransactionDateTime,
                                        Amount = outer.Amount,
                                        TransactionType = outer.TransactionType,
                                        CategoryId = outer.CategoryId,
                                        Category = inner
                                    }
                    ).ToList();

                    
            }
            else
            {
                transactionsDto = await _transactions.Find(FilterDefinition<Transaction>.Empty).Project(transation => new TransactionReadDto() { 
                    Id = transation.Id,
                    CategoryId = transation.CategoryId,
                    Description = transation.Description,
                    Amount = transation.Amount,
                    TransactionDateTime = transation.TransactionDateTime,
                    TransactionType = transation.TransactionType
                }).ToListAsync();
            }

            return Ok(transactionsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var queryFilter = Builders<Transaction>.Filter.Eq(x => x.Id, id);
            var transaction = await _transactions.Find(queryFilter).FirstOrDefaultAsync();

            return transaction is not null ? Ok(transaction) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Transaction transaction)
        {
            //var categoryExists = await _categories.Find(Builders<Category>.Filter.Eq(x => x.Id, transaction.CategoryId)).AnyAsync();
            //if (!categoryExists)
            //{
            //    return BadRequest($"Category with ID {transaction.CategoryId} does not exist.");
            //}
            await _transactions.InsertOneAsync(transaction);
            return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
        }


        [HttpPut]
        public async Task<ActionResult> Put([FromBody] Transaction transaction)
        {
            var queryFilter = Builders<Transaction>.Filter.Eq(x => x.Id, transaction.Id);

            var updateDefinition = Builders<Transaction>.Update
                .Set(x => x.Description, transaction.Description)
                .Set(x => x.TransactionDateTime, transaction.TransactionDateTime)
                .Set(x => x.Amount, transaction.Amount);

            var updateResult = await _transactions.UpdateOneAsync(queryFilter, updateDefinition);


            //await _categories.ReplaceOneAsync(queryFilter, category);

            return Ok();
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            var queryFilter = Builders<Transaction>.Filter.Eq(x => x.Id, id);
            var deleteResult = await _transactions.DeleteOneAsync(queryFilter);
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
