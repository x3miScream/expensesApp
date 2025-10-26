using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Data;
using Server.Enums;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("transactions")]
    public class Transaction: UserEntityBase
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime TransactionDateTime { get; set; } = DateTime.UtcNow;

        [BsonRepresentation(BsonType.String)]
        public TransactionType TransactionType { get; set; } = TransactionType.Expense;

        [BsonRepresentation(BsonType.ObjectId)]
        public string RecurringItemId { get; set; } = string.Empty;
    }
}
