namespace server.Dtos.Transaction
{
    public class TransactionReadDto
    {
        public long TransactionId {get;set;}   
        public decimal Amount { get; set; }
        public string? Note { get; set; }
        public DateTime TransactionDate {get;set;} = DateTime.Now;

        public long CategoryId {get;set;}
        public string CategoryCode {get;set;} = string.Empty;
        public string CategoryName {get;set;} = string.Empty;

        public long SubCategoryId {get;set;}
        public string SubCategoryCode {get;set;} = string.Empty;
        public string SubCategoryName {get;set;} = string.Empty;

        public string Icon {get;set;} = string.Empty;
        public string CategoryType {get;set;} = string.Empty;
    }
}