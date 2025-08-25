using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Server.Controllers.Base;
using Server.Models;

namespace server.Controllers.Categories;

[ApiController]
[Route("api/Categories")]
public class CategoryController : ApiBaseController
{
    private readonly IDistributedCache _distributedCache;
    public CategoryController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor,
        IDistributedCache distributedCache)
        : base(context, serviceProvider, appSettings, httpContextAccessor)
    {
        _distributedCache = distributedCache;
    }



    [HttpGet(Name = "GetCategories")]
    public async Task<ActionResult<List<CategoryReadDto>>> GetAllCategories(CancellationToken cancellationToken = default)
    {
        string cacheKey = $"products-all";
        List<Category> categories = new List<Category>();

        string cachedMember = await _distributedCache.GetStringAsync(cacheKey, cancellationToken);

        if (string.IsNullOrEmpty(cachedMember))
        {
            Console.WriteLine("From DB");

            categories = await _context.Categories.Where(x => x.ClientId == _currentClientId).ToListAsync();

            if (categories.Any())
            {
                _distributedCache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(categories), cancellationToken);
            }
        }
        else
        {
            Console.WriteLine("From Cache");

            categories = new List<Category>();
            categories = JsonConvert.DeserializeObject<List<Category>>(cachedMember,
             new JsonSerializerSettings
             { 
                ConstructorHandling = ConstructorHandling.AllowNonPublicDefaultConstructor
             });
        }

        return Ok(categories.Select(x => new CategoryReadDto()
        {
            CategoryId = x.CategoryId,
            CategoryCode = x.CategoryCode,
            CategoryName = x.CategoryName,
            Icon = x.Icon,
            CategoryType = x.CategoryType
        }).ToList());
    }


    [Route("{categoryId}")]
    // [HttpGet(Name = "GetCategoryById")]
    [HttpGet]
    public async Task<ActionResult<CategoryReadDto>> GetSingleCategory([FromRoute]long categoryId)
    {
        if(categoryId != null)
        {
            Category foundCategory = await _context.Categories.Where(x => x.ClientId == _currentClientId && x.CategoryId == categoryId).FirstOrDefaultAsync();

            if(foundCategory == null)
            {
                return BadRequest("No Category Found");
            }

            CategoryReadDto readDto = new CategoryReadDto(){
                CategoryId = foundCategory.CategoryId,
                CategoryCode = foundCategory.CategoryCode,
                CategoryName = foundCategory.CategoryName,
                Icon = foundCategory.Icon,
                CategoryType = foundCategory.CategoryType
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [HttpPost("PostCategory")]
    public async Task<ActionResult<CategoryReadDto>> Post(CategoryCreateDto createDto)
    {
        if(createDto != null)
        {
            Category newCategory = new Category(){
                CategoryCode = createDto.CategoryCode,
                CategoryName = createDto.CategoryName,
                Icon = createDto.Icon,
                CategoryType = createDto.CategoryType,
                ClientId = _currentClientId,
                CreatedBy = _currentUserId,
                CreatedDate = DateTime.Now,
                UpdatedBy = _currentUserId,
                UpdatedDate = DateTime.Now
            };

            await _context.Categories.AddAsync(newCategory);
            _context.SaveChanges();

            CategoryReadDto readDto = new CategoryReadDto(){
                CategoryId = newCategory.CategoryId,
                CategoryCode = newCategory.CategoryCode,
                CategoryName = newCategory.CategoryName,
                Icon = newCategory.Icon,
                CategoryType = newCategory.CategoryType
            };

            await _distributedCache.RemoveAsync($"products-all");

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [Route("{categoryId}")]
    [HttpPut(Name = "PutCategory`")]
    public async Task<ActionResult<CategoryReadDto>> Put([FromRoute] long categoryId, [FromBody]CategoryCreateDto createDto)
    {
        if(createDto != null)
        {
            List<string> errors = new List<string>();

            if(!await _context.Categories.AnyAsync(x => x.ClientId == _currentClientId && x.CategoryId == categoryId))
            {
                errors.Add("Category does not exist");
            }

            if(errors.Any())
                return BadRequest(errors);
            
            Category foundCategory = await _context.Categories.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.CategoryId == categoryId);

            if(foundCategory == null)
                return BadRequest("No Transaction Found");

            foundCategory.CategoryCode = createDto.CategoryCode;
            foundCategory.CategoryName = createDto.CategoryName;
            foundCategory.CategoryType = createDto.CategoryType;
            
            foundCategory.UpdatedBy = _currentUserId;
            foundCategory.UpdatedDate = DateTime.Now;

            _context.Categories.Update(foundCategory);
            _context.SaveChanges();

            CategoryReadDto readDto = new CategoryReadDto(){
                CategoryId = foundCategory.CategoryId,
                CategoryCode = foundCategory.CategoryCode,
                CategoryName = foundCategory.CategoryName,
                CategoryType = foundCategory.CategoryType
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [HttpDelete]
    [Route("{categoryId}")]
    public async Task<ActionResult<bool>> Delete([FromRoute]long categoryId)
    {
        if(categoryId != null)
        {
            Category foundCategory =await _context.Categories.FindAsync(categoryId);

            if(foundCategory == null)
            {
                return BadRequest("No Category Found");
            }

            _context.Categories.Remove(foundCategory);
            _context.SaveChanges();


            return Ok(true);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }



}
