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
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime TransactionDateTime { get; set; } = DateTime.UtcNow;
        public TransactionType TransactionType { get; set; } = TransactionType.Expense;
        public Category? Category { get; set; } = null;
    }
}
