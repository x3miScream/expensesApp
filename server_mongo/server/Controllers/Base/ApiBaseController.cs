using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
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



        public void ApplyUserFilter<T>(ref FilterDefinition<T> filterDefinition) where T : UserEntityBase
        {
            var builder = Builders<T>.Filter;
            var userFilter = builder.Eq(x => x.UserId, _currentUserId);
            if (filterDefinition == null || filterDefinition == builder.Empty)
            {
                filterDefinition = userFilter;
            }
            else
            {
                filterDefinition = builder.And(filterDefinition, userFilter);
            }
        }



        public FilterDefinition<T> ApplyUserFilter<T>(FilterDefinition<T> filterDefinition) where T : UserEntityBase
        {
            ApplyUserFilter<T>(ref filterDefinition);

            return filterDefinition;
        }



        public void ApplyUserBaseFieldUpdate<T>(ref UpdateDefinition<T> updateDefinition, bool isNew = false) where T : UserEntityBase
        {
            updateDefinition.Set(x => x.UserId, _currentUserId)
                            .Set(x => x.UpdatedBy, _currentUserId)
                            .Set(x => x.UpdatedAt, DateTime.UtcNow);

            if(isNew)
            {
                updateDefinition.Set(x => x.CreatedBy, _currentUserId)
                                .Set(x => x.CreatedAt, DateTime.UtcNow);
            }
        }



        protected void ApplyUserBaseFieldUpdate<T>(T entity, bool isNew = false) where T : UserEntityBase
        {
            DateTime currentDateTime = DateTime.UtcNow;

            if (isNew)
            {
                entity.CreatedBy = _currentUserId;
                entity.CreatedAt = currentDateTime;
                entity.UserId = _currentUserId;
            }
            entity.UpdatedBy = _currentUserId;
            entity.UpdatedAt = currentDateTime;
        }



        private void SetAuthSessionData()
        {
            if (_httpContextAccessor?.HttpContext?.Items?.ContainsKey("UserId") ?? false)
            {
                _currentUserId = _httpContextAccessor?.HttpContext?.Items?["UserId"]?.ToString() ?? string.Empty;
            }
        }
    }
}
