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


    public AuthController(ApplicationDBContext context, IServiceProvider serviceProvider)
        : base(context, serviceProvider)
        {

        }

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


        AuthDto dto = new AuthDto(){
            UserId = foundUser.UserId,
            UserName = foundUser.UserName
        };

        return Ok(dto);

    }
} 