using Microsoft.AspNetCore.Mvc;
using Server.Controllers.Base;
using Server.Models;

namespace Server.Controllers.Categories;

[ApiController]
[Route("api/Categories")]
public class SubCategoryController : ApiBaseController {
    public SubCategoryController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor)
        : base(context, serviceProvider, appSettings, httpContextAccessor){
    }

    
}