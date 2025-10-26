using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Entities
{
    public class EntityBase
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UpdatedBy { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
}
