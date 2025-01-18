using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Models.Base;

namespace Server.Models{
    [Table("Transactions")]
    public class Transaction : UserBaseModel{
        [Key]
        public long TransactionId {get;set;}

        
        public long CategoryId {get;set;}
        public Category? Category {get;set;}


        public long? SubCategoryId {get;set;}
        public SubCategory? SubCategory {get;set;}
        
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Column(TypeName = "nvarchar(2000)")]
        public string? Note { get; set; }
        [Column(TypeName = "DateTime")]
        public DateTime TransactionDate {get;set;} = DateTime.Now;
    }
}