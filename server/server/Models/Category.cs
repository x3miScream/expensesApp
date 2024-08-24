using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models{
    [Table("Categories")]
    public class Category{
        [Key]
        public int CategoryId {get;set;}
        public string CategoryCode {get;set;} = string.Empty;
        public string CategoryName {get;set;} = string.Empty;
        public string CategoryIcon {get;set;} = string.Empty;
        public string CategoryType {get;set;} = string.Empty;
    }
}