using System.Security.Claims;

namespace Server.Interfaces;

public interface IAuthService{
    string GenerateJwtToken(string userId);
    ClaimsPrincipal ValidateJWTToken(string token, out string errors);
}