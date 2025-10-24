using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Entities;
using Server.Enums;

namespace Server.Dto
{
    public class TransactionReadDto
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime DateVal { get; set; } = DateTime.UtcNow;
        public string Date { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
        public TransactionType TransactionType { get; set; } = TransactionType.Expense;
        public Category? CategoryData { get; set; } = null;

        [BsonRepresentation(BsonType.ObjectId)]
        public string RecurringItemId { get; set; } = string.Empty;
    }
}
