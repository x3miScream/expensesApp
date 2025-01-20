using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Controllers.Base;
using Server.Dtos.Category;
using Server.Models;

namespace Server.Controllers.Categories;

[ApiController]
[Route("api/Categories/{categoryId}/SubCategories")]
public class SubCategoryController : ApiBaseController {
    public SubCategoryController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor)
        : base(context, serviceProvider, appSettings, httpContextAccessor){
    }

    [HttpGet(Name = "GetSubCategories")]
    public async Task<ActionResult<List<SubCategoryReadDto>>> Get([FromRoute] long categoryId)
    {
        List<SubCategory> subCategories = await _context.SubCategories.Where(x => x.ClientId == _currentClientId && x.CategoryId == categoryId).OrderBy(x => x.SubCategoryName).ToListAsync();
        Dictionary<long, Category> catDict = _context.Categories.Where(x => x.ClientId == _currentClientId).ToDictionary(x => x.CategoryId, x => x);

        return Ok(subCategories.Select(x => new SubCategoryReadDto(){
            SubCategoryId = x.SubCategoryId,
            SubCategoryCode = x.SubCategoryCode,
            SubCategoryName = x.SubCategoryName,
            CategoryId = x.CategoryId,
            CategoryCode = catDict[x.CategoryId]?.CategoryCode,
            CategoryName = catDict[x.CategoryId]?.CategoryName
        }).ToList());
    }

    

    [HttpPost(Name = "CreateSubCategory")]
    public async Task<ActionResult<List<SubCategoryReadDto>>> Post([FromRoute] long categoryId, [FromBody] SubCategoryCreateDto dto)
    {
        List<string> errors = new List<string>();
        Category cat = await _context.Categories.Where(x => x.ClientId == _currentClientId && x.CategoryId == categoryId).FirstOrDefaultAsync();

        if(cat == null)
            errors.Add("Category not found");

        if(dto == null)
            errors.Add("No data provided");

        if(string.IsNullOrEmpty(dto?.SubCategoryCode))
            errors.Add("Sub Category Code cannot be empty");

        if(string.IsNullOrEmpty(dto?.SubCategoryName))
            errors.Add("Sub Category Name cannot be empty");

        if(dto != null)
        {
            bool exists = await _context.SubCategories.Where(x => x.ClientId == _currentClientId && x.CategoryId == categoryId && x.SubCategoryCode == dto.SubCategoryCode).AnyAsync();

            if(exists)
                errors.Add("Sub Category Code exists");
        }

        if(errors.Any())
            return BadRequest(errors);

        SubCategory subCat = new SubCategory(){
            CategoryId = categoryId,
            SubCategoryCode = dto?.SubCategoryCode,
            SubCategoryName = dto?.SubCategoryName
        };

        await _context.SubCategories.AddAsync(subCat);
        await _context.SaveChangesAsync();

        return Ok( new SubCategoryReadDto(){
            SubCategoryId = subCat.SubCategoryId,
            SubCategoryCode = subCat?.SubCategoryCode,
            SubCategoryName = subCat?.SubCategoryName,
            CategoryId = subCat.CategoryId,
            CategoryCode = cat?.CategoryCode,
            CategoryName = cat?.CategoryName
        });
    }

    
}