namespace Server.Dtos.DropDownList;

public class DropDownListItemDto
{
    public DropDownListItemDto(object key, string value){
        Key = key;
        Value = value;
    }
    public object Key {get;set;}
    public string Value {get;set;}
}