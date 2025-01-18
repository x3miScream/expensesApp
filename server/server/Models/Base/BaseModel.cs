namespace Server.Models.Base;

public class BaseModel{
    public long ClientId {get;set;}
    public long CreatedBy {get;set;}
    public DateTime CreatedDate {get;set;}
    public long UpdatedBy {get;set;}
    public DateTime UpdatedDate {get;set;}
}