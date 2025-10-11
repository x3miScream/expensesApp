﻿using MongoDB.Driver;

namespace Server.Data
{
    public class MongoDBService
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase? _mongoDatabase;

        public IMongoDatabase? _MongoDatabase => _mongoDatabase;



        public MongoDBService(IConfiguration configuration, IMongoDatabase mongoDatabase)
        {
            _configuration = configuration;
            _mongoDatabase = mongoDatabase;

            var connectionString = _configuration.GetConnectionString("MongoDBConnection");
            var database = _configuration.GetConnectionString("MongoDBDatabase");
            var mongoUrl = MongoUrl.Create(string.Format("{0}/{1}", connectionString, database));
            var mongoClient = new MongoClient(mongoUrl);

            _mongoDatabase = mongoClient.GetDatabase(mongoUrl.DatabaseName);
        }
    }
}
