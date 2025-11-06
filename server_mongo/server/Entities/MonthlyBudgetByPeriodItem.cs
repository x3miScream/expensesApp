using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("monthlyBudgetByPeriodItems")]
    public class MonthlyBudgetByPeriodItem : UserEntityBase
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string MonthlyBudgetByPeriodId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string RecurringItemId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal CurrentRunningAmount { get; set; } = 0;
    }
}
