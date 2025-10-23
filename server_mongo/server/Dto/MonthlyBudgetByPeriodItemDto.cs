using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Dto
{
    public class MonthlyBudgetByPeriodItemDto
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string MonthlyBudgetId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string MonthlyBudgetByPeriodId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string MonthlyBudgetByPeriodItemId { get; set; } = string.Empty;

        public int Period { get; set; } = 0;


        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; } = string.Empty;
        public string CategoryCode { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;


        [BsonRepresentation(BsonType.ObjectId)]
        public string RecurringItemId { get; set; } = string.Empty;
        public string RecurringItemCode { get; set; } = string.Empty;
        public string RecurringItemName { get; set; } = string.Empty;
        public string RecurringItemDescription { get; set; } = string.Empty;
        public decimal PlannedBudget { get; set; } = 0;
        public decimal CurrentRunningAmount { get; set; } = 0;

    }
}
