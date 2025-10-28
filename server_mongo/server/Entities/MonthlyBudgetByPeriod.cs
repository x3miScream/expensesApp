using MongoDB.Bson.Serialization.Attributes;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("monthlyBudgetByPeriods")]
    public class MonthlyBudgetByPeriod
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string MonthlyBudgetId { get; set; } = string.Empty;

        public int Period { get; set; } = 0;
        public decimal PlannedMonthlyBudget { get; set; } = 0;
        public decimal BudgetAdjustment { get; set; } = 0;

    }
}
