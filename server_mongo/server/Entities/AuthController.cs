using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Controllers.Base;
using Server.Data;
using Server.Dto.Auth;
using Server.Interfaces;
using Server.Services;
using Server.Utils;

namespace Server.Entities
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ApiBaseController
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IMongoCollection<User> _userCollection;
        private readonly IAuthService _authService;
        private readonly IConfiguration _appsettings;

        public AuthController(MongoDBService mongoDBService, IAuthService authService, IConfiguration appsettings, IHttpContextAccessor httpContextAccessor)
            : base(httpContextAccessor)
        {
            _mongoDBService = mongoDBService;
            _authService = authService;
            _userCollection = mongoDBService._MongoDatabase.GetCollection<User>(MongoDocumentTypeAttributeReader.GetMongoDocumentType<User>());
            _appsettings = appsettings;
        }






        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<AuthDto>> Login([FromBody] LoginDto loginDto)
        {
            List<string> errors = new List<string>();

            if (loginDto == null) loginDto = new LoginDto();

            if (string.IsNullOrEmpty(loginDto.UserEmail))
                errors.Add("Email canno be empty");

            if (string.IsNullOrEmpty(loginDto.Password))
                errors.Add("Password canno be empty");

            if (errors.Any())
                return BadRequest(errors);

            User foundUser = await _userCollection.Find(Builders<User>.Filter.Eq(x => x.Email, loginDto.UserEmail)).FirstOrDefaultAsync();

            if (foundUser == null)
                errors.Add("Wrong login or password");
            else
            {
                if (foundUser.PasswordHash != EncryptionService.GenerateHash(loginDto.Password, foundUser.PasswordSaltKey))
                    errors.Add("Wrong login or password");
            }

            if (errors.Any())
                return BadRequest(errors);

            string jwtToken = _authService.GenerateJwtToken(foundUser?.Id);
            var cookieOptions = new CookieOptions()
            {
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7),
                HttpOnly = false,
                Secure = true
            };

            Response.Cookies.Append(_appsettings["Authentication:AuthJWTTokenName"]?.ToString(), jwtToken, cookieOptions);

            AuthDto dto = new AuthDto()
            {
                UserName = foundUser.UserName
            };

            return Ok(dto);

        }





        [AllowAnonymous]
        [HttpGet]
        [Route("getCurrentAuthUser")]
        public async Task<ActionResult<string>> GetCurrentAuthUser()
        {
            User foundUser = await _userCollection.Find(Builders<User>.Filter.Eq(x => x.Id, _currentUserId)).FirstOrDefaultAsync();

            if (foundUser == null)
                return BadRequest("User Not Found");

            AuthDto dto = new AuthDto()
            {
                UserName = foundUser.UserName
            };

            return Ok(dto);

        }

        [HttpDelete(Name = "Logout")]
        public async Task<ActionResult<string>> Logout()
        {

            var cookieOptions = new CookieOptions()
            {
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(-1),
                HttpOnly = false,
                Secure = true
            };

            Response.Cookies.Delete(_appsettings["Authentication:AuthJWTTokenName"]?.ToString(), cookieOptions);
            Console.WriteLine(JsonSerializer.Serialize(Response.Cookies));

            return Ok("Logout successful");

        }
    }
}
