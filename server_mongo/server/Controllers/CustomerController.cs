using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Data;
using Server.Entities;

namespace Server.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<Customer> _customers;
        public CustomerController(MongoDBService mongoDBService) 
        { 
            _mongoDBService = mongoDBService;
            _mongoDBService._MongoDatabase.
        }
    }
}
