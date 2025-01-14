namespace server.Dtos;

public class UserCreateDto{
    public long UserId {get;set;}
    public string UserName {get;set;} = string.Empty;
    public string UserLoginId {get;set;} = string.Empty;
    public string Password {get;set;} = string.Empty;
}