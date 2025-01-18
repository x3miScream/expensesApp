using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Models.Base;

namespace Server.Models{
    [Table("Categories")]
    public class Category : BaseModel{
        [Key]
        public long CategoryId {get;set;}
        [Column(TypeName = "nvarchar(50)")]
        public string CategoryCode {get;set;} = string.Empty;
        [Column(TypeName = "nvarchar(200)")]
        public string CategoryName {get;set;} = string.Empty;
        [Column(TypeName = "varchar(50)")]
        public string Icon {get;set;} = string.Empty;
        [Column(TypeName = "varchar(50)")]
        public string CategoryType {get;set;} = string.Empty;
    }
}