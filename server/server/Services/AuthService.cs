using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Server.Interfaces;

namespace Server.Services;

public class AuthService : IAuthService {
    private readonly IConfiguration _appSettings;
    public AuthService(IConfiguration appSettings){
        _appSettings = appSettings;
    }

    private const string _authenticationSecretKey = "ooLWIoYOV1wTaBkcexnmclcsmLcRIEMGY2ag99AVyHI=";

    public string GenerateJwtToken(string userId)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_authenticationSecretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("UserId", userId) }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _appSettings["Authentication:ValidIssuer"]?.ToString(),
            Audience = _appSettings["Authentication:ValidAudience"]?.ToString(),

            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }


    public ClaimsPrincipal ValidateJWTToken(string token, out string errors){
        var key = Encoding.ASCII.GetBytes(_authenticationSecretKey);
        errors = string.Empty;

        try{
            var tokenHandler = new JwtSecurityTokenHandler();
            var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters{
                ValidateIssuerSigningKey = true,
                ValidIssuer = _appSettings["Authentication:ValidIssuer"]?.ToString(),
                ValidAudience = _appSettings["Authentication:ValidAudience"]?.ToString(),
                IssuerSigningKey = new SymmetricSecurityKey(key)
            }, out SecurityToken validatedToken);

            return claimsPrincipal;
        }
        catch(SecurityTokenExpiredException ex){
            errors = "Token has expired";
            return null;
        }
        catch(SecurityTokenException ex){
            errors = "Invalid Token";
            return null;
        }
    }
}