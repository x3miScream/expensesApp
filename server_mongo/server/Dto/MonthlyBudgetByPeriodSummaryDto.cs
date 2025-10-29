using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Dto
{
    public class MonthlyBudgetByPeriodWeeklySummaryDto
    {
        public int WeekNumber { get; set; } = 0;
        public DateTime WeekStartDate { get; set; } = DateTime.MinValue;
        public DateTime WeekEndDate { get; set; } = DateTime.MinValue;
        public decimal WeeklyPlannedBudget { get; set; } = 0;
        public decimal WeeklyRemainingBudget { get; set; } = 0;
        public decimal WeeklyTotalExpenses { get; set; } = 0;
        public int TotalDaysInWeek { get; set; } = 0;
    }

    public class MonthlyBudgetByPeriodSummaryDto
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string MonthlyBudgetId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string MonthlyBudgetByPeriodId { get; set; } = string.Empty;
        public int Period { get; set; } = 0;

        public decimal DailyRemainingBudget { get; set; } = 0;
        public List<MonthlyBudgetByPeriodWeeklySummaryDto> WeeklyRemainingBudget { get; set; } = new List<MonthlyBudgetByPeriodWeeklySummaryDto>();
        public decimal TotalMonthlyBudget { get; set; } = 0;
        public decimal MonthlyRemainingBudget { get; set; } = 0;
        public decimal TotalMonthlyExpenses { get; set; } = 0;
    }
}
