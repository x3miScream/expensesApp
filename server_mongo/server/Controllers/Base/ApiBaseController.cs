using Microsoft.AspNetCore.Mvc;
using Server.Entities;

namespace Server.Controllers.Base
{
    public class ApiBaseController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        protected string _currentUserId;

        public ApiBaseController(IHttpContextAccessor httpContextAccessor)
        {
            _currentUserId = string.Empty;
            _httpContextAccessor = httpContextAccessor;
            SetAuthSessionData();
        }

        private void SetAuthSessionData()
        {
            if (_httpContextAccessor?.HttpContext?.Items?.ContainsKey("UserId") ?? false)
            {
                _currentUserId = _httpContextAccessor?.HttpContext?.Items?["UserId"]?.ToString() ?? string.Empty;
            }
        }


        protected void UpdateUserEntityBaseFields<T>(T entity, bool isNewEntity) where T : UserEntityBase
        {
            DateTime currentDateTime = DateTime.UtcNow;
            
            if (isNewEntity)
            {

                entity.CreatedBy = _currentUserId;
                entity.CreatedAt = currentDateTime;
                entity.UserId = _currentUserId;
            }
            entity.UpdatedBy = _currentUserId;
            entity.UpdatedAt = currentDateTime;
        }
    }
}
