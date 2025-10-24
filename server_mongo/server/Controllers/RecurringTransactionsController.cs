using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Data;
using Server.Dto;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/recurringTransactions")]
    public class RecurringTransactionsController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        private readonly IMongoCollection<Category>? _categoryCollection;
        private readonly IMongoCollection<RecurringItem>? _recurringItemCollection;

        public RecurringTransactionsController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
            _categoryCollection = _mongoDBService._MongoDatabase.GetCollection<Category>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>());
            _recurringItemCollection = _mongoDBService._MongoDatabase.GetCollection<RecurringItem>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<RecurringItem>());
        }


        [HttpGet]
        public async Task<ActionResult<List<RecurringItemDto>>> Get()
        {
            List<RecurringItemDto> result = new List<RecurringItemDto>();

            List<Category> categories = await _categoryCollection.Find(Builders<Category>.Filter.Empty).ToListAsync();
            List<RecurringItem> recurringItems = await _recurringItemCollection.Find(Builders<RecurringItem>.Filter.Empty).ToListAsync();

            if(recurringItems.Any())
            {
                result = recurringItems.Join(categories,
                    outer => outer.CategoryId,
                    inner => inner.Id,
                    (outer, inner) => new RecurringItemDto()
                    {
                        RecurringItemId = outer.Id,
                        RecurringItemCode = outer.RecurringItemCode,
                        RecurringItemName = outer.RecurringItemName,
                        RecurringItemDescription = outer.Description,
                        CategoryId = outer.CategoryId,
                        CategoryCode = inner.CategoryCode,
                        CategoryName = inner.CategoryName
                    }).OrderBy(x => x.CategoryName).ThenBy(x => x.RecurringItemName).ToList();
            }

            return Ok(result);
        }
    }
}
