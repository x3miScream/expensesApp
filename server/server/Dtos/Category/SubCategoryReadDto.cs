namespace Server.Dtos.Category;

public class SubCategoryReadDto{
    public long SubCategoryId {get;set;}
    public string SubCategoryCode {get;set;} = string.Empty;
    public string SubCategoryName {get;set;} = string.Empty;

    public long CategoryId {get;set;}
    public string CategoryCode {get;set;} = string.Empty;
    public string CategoryName {get;set;} = string.Empty;
}