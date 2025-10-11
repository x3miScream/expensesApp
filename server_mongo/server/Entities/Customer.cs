using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Entities
{
    public class Customer
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId )]
        public string Id { get; set; } = string.Empty;

        [BsonElement("customer_name"), BsonRepresentation(BsonType.String)]
        public string CustomerName { get; set; } = string.Empty;

        [BsonElement("email"), BsonRepresentation(BsonType.String)]
        public string Email { get; set; } = string.Empty;
    }
}
