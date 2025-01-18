using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Controllers.Base;
using Server.Dtos;
using Server.Interfaces;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/Auth")]
public class AuthController : ApiBaseController{
    private IEncryptionService _encryptionService;
    public IEncryptionService encryptionService
    {
        get
        {
            if(_encryptionService == null)
                _encryptionService = _serviceProvider?.GetService<IEncryptionService>();

            return _encryptionService;
        }
    }


    private IAuthService _authService;
    public IAuthService authService
    {
        get
        {
            if(_authService == null)
                _authService = _serviceProvider?.GetService<IAuthService>();

            return _authService;
        }
    }



    public AuthController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor)
        : base(context, serviceProvider, appSettings, httpContextAccessor)
        {

        }

    [AllowAnonymous]
    [HttpPost(Name = "Login")]
    public async Task<ActionResult<AuthDto>> Login([FromBody] LoginDto loginDto){
        List<string> errors = new List<string>();

        if(loginDto == null) loginDto = new LoginDto();

        if(string.IsNullOrEmpty(loginDto.UserLoginId))
            errors.Add("User Login Id canno be empty");

        if(string.IsNullOrEmpty(loginDto.Password))
            errors.Add("Password canno be empty");

        if(errors.Any())
            return BadRequest(errors);

        User foundUser = await _context.Users.FirstOrDefaultAsync(x => x.UserLoginId.ToLower() == loginDto.UserLoginId.ToLower());

        if(foundUser == null)
            errors.Add("Wrong login or password");
        else
        {
            if(foundUser.Password != encryptionService.GenerateHash(loginDto.Password, foundUser.Salt))
                errors.Add("Wrong login or password");
        }

        if(errors.Any())
            return BadRequest(errors);

        string jwtToken = authService.GenerateJwtToken(foundUser?.UserId.ToString());
        var cookieOptions = new CookieOptions(){
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7),
            HttpOnly = false,
            Secure = true
        };

        Response.Cookies.Append(_appsettings["Authentication:AuthJWTTokenName"]?.ToString(), jwtToken, cookieOptions);

        AuthDto dto = new AuthDto(){
            UserName = foundUser.UserName
        };

        return Ok(dto);

    }

    [AllowAnonymous]
    [HttpGet(Name = "GetCurrentAuthUser")]
    public async Task<ActionResult<string>> GetCurrentAuthUser(){
        User foundUser = await _context.Users.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.UserId == _currentUserId);

        if(foundUser == null)
            return BadRequest("User Not Found");

        AuthDto dto = new AuthDto(){
            UserName = foundUser.UserName
        };

        return Ok(dto);

    }

    [HttpDelete(Name = "Logout")]
    public async Task<ActionResult<string>> Logout(){
        Response.Cookies.Delete(_appsettings["Authentication:AuthJWTTokenName"]?.ToString());
        Console.WriteLine(_appsettings["Authentication:AuthJWTTokenName"]?.ToString());

        return Ok("Logout successful");

    }
} 