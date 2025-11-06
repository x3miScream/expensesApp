using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("monthlyBudgets")]
    public class MonthlyBudget : UserEntityBase
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        public string BudgetCode { get; set; } = string.Empty;
        public string BudgetName { get; set; } = string.Empty;
    }
}
