using System.Transactions;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Data;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<User> _userCollection;

        public UserController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;

            _userCollection = _mongoDBService._MongoDatabase.GetCollection<User>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<User>());
        }


        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAll()
        {
            var users = await _userCollection.Find(Builders<User>.Filter.Empty).ToListAsync();

            return Ok(users);
        }


        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<User>> GetById(string id)
        {
            User user = await _userCollection.Find(Builders<User>.Filter.Eq(x => x.Id, id)).FirstOrDefaultAsync();

            if(user == null)
                return NotFound();

            return Ok(user);
        }


        [HttpPost]
        public async Task<ActionResult> Post(string userName, string password, string email)
        {
            if (string.IsNullOrEmpty(userName))
                return BadRequest("User Name cannot be empty");

            if (string.IsNullOrEmpty(password))
                return BadRequest("Password cannot be empty");

            if (string.IsNullOrEmpty(email))
                return BadRequest("Email cannot be empty");

            User duplicatedUser = await _userCollection.Find(Builders<User>.Filter.Eq(x => x.Email, email)).FirstOrDefaultAsync();

            if(duplicatedUser != null)
                return BadRequest("Email is already registered");


            User newUser = new User()
            {
                UserName = userName,
                Email = email
            };


            newUser.PasswordSaltKey = EncryptionService.GenerateNewSaltKey();
            newUser.PasswordHash = EncryptionService.GenerateHash(password, newUser.PasswordSaltKey);

            await _userCollection.InsertOneAsync(newUser);

            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, newUser);
        }
    }
}
