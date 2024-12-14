namespace server.Dtos.Transaction
{
    public class TransactionReadDto
    {
        public long TransactionId {get;set;}   
        public long CategoryId {get;set;}
        public CategoryReadDto? Category {get;set;}
        public decimal Amount { get; set; }
        public string? Note { get; set; }
        public DateTime TransactionDate {get;set;} = DateTime.Now;
    }
}