using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("users")]
    public class User
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PasswordSaltKey { get; set; } = string.Empty;
    }
}
