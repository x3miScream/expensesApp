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



        public MongoDBService(IConfiguration configuration, IOptions<ConnectionStringsConfigurations> connectionStringsConfigurations)
        {
            _configuration = configuration;
            _connectionStringsConfigurations = connectionStringsConfigurations;

            Console.WriteLine(connectionStringsConfigurations?.Value?.MongoDBConnectionString);
            var mongoUrl = MongoUrl.Create(connectionStringsConfigurations?.Value?.MongoDBConnectionString);

            var mongoClient = new MongoClient(mongoUrl);

            _mongoDatabase = mongoClient.GetDatabase(connectionStringsConfigurations?.Value?.DatabaseName);
        }
    }
}
