using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Dto
{
    public class RecurringItemDto
    {
        public string RecurringItemId { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;

        public string CategoryCode { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;

        public string RecurringItemCode { get; set; } = string.Empty;
        public string RecurringItemName { get; set; } = string.Empty;
        public string RecurringItemDescription { get; set; } = string.Empty;
    }
}
