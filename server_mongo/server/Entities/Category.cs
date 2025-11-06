using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Data;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("categories")]
    public class Category : UserEntityBase
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId )]
        public string Id { get; set; } = string.Empty;

        [BsonElement("category_name"), BsonRepresentation(BsonType.String)]
        public string CategoryName { get; set; } = string.Empty;

        [BsonElement("category_code"), BsonRepresentation(BsonType.String)]
        public string CategoryCode { get; set; } = string.Empty;
    }
}
