using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models{
    [Table("Transactions")]
    public class Transaction{
        [Key]
        public int TransactionId {get;set;}


        public int CategoryId {get;set;}
        public Category? Category {get;set;}
        
        
        public decimal Amount { get; set; }
        public string? Note { get; set; }
        public DateTime TransactionDate {get;set;} = DateTime.Now;
    }
}