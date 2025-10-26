using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Entities
{
    public class UserEntityBase : EntityBase
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;
    }
}
