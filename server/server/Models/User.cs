using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

[Table("Users")]
public class User{
    [Key]
    public long UserId {get;set;}

    [Column(TypeName = "nvarchar(400)")]
    public string UserName {get;set;} = string.Empty;

    [Column(TypeName = "nvarchar(400)")]
    public string UserLoginId {get;set;} = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string Password {get;set;} = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string Salt {get;set;} = string.Empty;
}