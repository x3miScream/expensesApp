using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("recurringItems")]
    public class RecurringItem : UserEntityBase
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; } = string.Empty;
        public string RecurringItemCode { get; set; } = string.Empty;
        public string RecurringItemName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
