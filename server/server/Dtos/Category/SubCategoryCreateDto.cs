namespace Server.Dtos.Category;

public class SubCategoryCreateDto{
    public long SubCategoryId {get;set;}
    public long CategoryId {get;set;}
    public string SubCategoryCode {get;set;} = string.Empty;
    public string SubCategoryName {get;set;} = string.Empty;
}