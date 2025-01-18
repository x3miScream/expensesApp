using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Models.Base;

namespace Server.Models;

[Table("SubCategories")]
public class SubCategory: BaseModel{
    [Key]
    public long SubCategoryId {get;set;}

    public long CategoryId {get;set;}
    public Category? Category {get;set;}

    [Column(TypeName = "nvarchar(50)")]
    public string SubCategoryCode {get;set;} = string.Empty;
    [Column(TypeName = "nvarchar(200)")]
    public string SubCategoryName {get;set;} = string.Empty;
}