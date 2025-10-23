using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Server.Utils;

namespace Server.Entities
{
    [MongoDocumentType("monthlyBudgetSetupItems")]
    public class MonthlyBudgetSetupItem
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        [BsonRepresentation(BsonType.ObjectId)]
        public string MonthlyBudgetId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string RecurringItemId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal PlannedBudget { get; set; } = 0;

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Adjustment { get; set; } = 0;


        [BsonIgnore]
        public decimal ActualBudget
        {
            get
            {
                return PlannedBudget + Adjustment;
            }
        }
    }
}
