namespace Server.Dtos.DropDownList;

public class DropDownListItemDto
{
    public DropDownListItemDto(long key, string value){
        Key = key;
        Value = value;
    }
    public long Key {get;set;}
    public string Value {get;set;}
}