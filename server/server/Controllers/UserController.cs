using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Dtos;
using Server.Controllers.Base;
using Server.Interfaces;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/Users")]
public class UserController : ApiBaseController{
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

    public UserController(ApplicationDBContext context, IServiceProvider serviceProvider)
        : base(context, serviceProvider) {
    }

    public async Task<ActionResult<UserReadDto>> Post([FromBody]UserCreateDto createDto)
    {
        if(createDto != null)
        {
            User duplicatedUser = await _context.Users.FirstOrDefaultAsync(x => x.UserLoginId.ToLower() == createDto.UserLoginId.ToLower());

            if(duplicatedUser != null)
            {
                return BadRequest("User with same login id already exists");
            }

            string salt = encryptionService.GenerateNewSaltKey();

            User user = new User(){
                UserName = createDto.UserName,
                UserLoginId = createDto.UserLoginId,
                Password = encryptionService.GenerateHash(createDto.Password, salt),
                Salt = salt
            };

            await _context.Users.AddAsync(user);
            _context.SaveChanges();

            User newUser = await _context.Users.FindAsync(user.UserId);

            UserReadDto readDto = new UserReadDto(){
                UserId = user.UserId,
                UserName = user.UserName,
                UserLoginId = user.UserLoginId,
                Password = user.Password,
                Salt = user.Salt    
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }
}