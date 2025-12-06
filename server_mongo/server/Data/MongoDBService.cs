using System.Text;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Server.Configurations;

namespace Server.Data
{
    public class MongoDBService
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase? _mongoDatabase;
        private readonly IOptions<ConnectionStringsConfigurations> _connectionStringsConfigurations;

        public IMongoDatabase? _MongoDatabase => _mongoDatabase;



        public MongoDBService(IConfiguration configuration, IOptions<ConnectionStringsConfigurations> connectionStringsConfigurations, ILogger<MongoDBService> logger)
        {
            _configuration = configuration;
            _connectionStringsConfigurations = connectionStringsConfigurations;

            logger.LogInformation("MongoDBConnectionString: {MongoDBConnectionString}", connectionStringsConfigurations?.Value?.MongoDBConnectionString);
            var mongoUrl = MongoUrl.Create(connectionStringsConfigurations?.Value?.MongoDBConnectionString);
            logger.LogInformation("mongoUrl: {mongoUrl}", mongoUrl);
            var mongoClient = new MongoClient(mongoUrl);

            _mongoDatabase = mongoClient.GetDatabase(connectionStringsConfigurations?.Value?.DatabaseName);
        }
    }
}
