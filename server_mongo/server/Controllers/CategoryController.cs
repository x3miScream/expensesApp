using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Data;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<Category>? _categories;
        public CategoryController(MongoDBService mongoDBService) 
        { 
            _mongoDBService = mongoDBService;
            _categories = _mongoDBService._MongoDatabase.GetCollection<Category>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>());
        }




        [HttpGet]
        public async Task<ActionResult<Category>> Get()
        {
            var categories = await _categories.Find(FilterDefinition<Category>.Empty).ToListAsync();

            return Ok(categories);
        }




        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetById(string id)
        {
            var queryFilter = Builders<Category>.Filter.Eq(x => x.Id, id);
            var category = await _categories.Find(queryFilter).FirstOrDefaultAsync();

            return category is not null ? Ok(category) : NotFound();
        }


        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Category category)
        {
            await _categories.InsertOneAsync(category);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }


        [HttpPut]
        public async Task<ActionResult> Put([FromBody] Category category)
        {
            var queryFilter = Builders<Category>.Filter.Eq(x => x.Id, category.Id);

            var updateDefinition = Builders<Category>.Update
                .Set(x => x.CategoryName, category.CategoryName)
                .Set(x => x.CategoryCode, category.CategoryCode);

            var updateResult = await _categories.UpdateOneAsync(queryFilter, updateDefinition);


            //await _categories.ReplaceOneAsync(queryFilter, category);

            return Ok();
        }


        [HttpDelete]
        public async Task<ActionResult> Delete(string id)
        {
            var queryFilter = Builders<Category>.Filter.Eq(x => x.Id, id);
            var deleteResult = await _categories.DeleteOneAsync(queryFilter);
            return Ok();
        }
    }
}
