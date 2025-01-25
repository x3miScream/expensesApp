using System.IO.Compression;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using server.Dtos.Transaction;
using Server.Controllers.Base;
using Server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/Transactions")]
public class TransactionController : ApiBaseController
{
    public TransactionController(ApplicationDBContext context, IServiceProvider serviceProvider, IConfiguration appSettings, IHttpContextAccessor httpContextAccessor)
        : base(context, serviceProvider, appSettings, httpContextAccessor){
    }



    [HttpGet(Name = "GetTransactions")]
    public async Task<ActionResult<List<TransactionReadDto>>> Get()
    {
        List<Transaction> transactions = await _context.Transactions.Where(x => x.ClientId == _currentClientId && x.UserId == _currentUserId).OrderByDescending(x => x.TransactionDate).ToListAsync();
        Dictionary<long, Category> categoriesDict = await _context.Categories.Where(x => x.ClientId == _currentClientId).ToDictionaryAsync(x => x.CategoryId, x => x);
        Dictionary<long, SubCategory> subCategoriesDict = await _context.SubCategories.Where(x => x.ClientId == _currentClientId).ToDictionaryAsync(x => x.SubCategoryId, x => x);

        return Ok(transactions.Select(x => new TransactionReadDto(){
            TransactionId = x.TransactionId,
            CategoryId = x.CategoryId,
            SubCategoryId = x.SubCategoryId,
            Amount = x.Amount,
            Note = x.Note,
            TransactionDate = x.TransactionDate,
            CategoryCode = categoriesDict[x.CategoryId].CategoryCode,
            CategoryName = categoriesDict[x.CategoryId].CategoryName,
            CategoryType = categoriesDict[x.CategoryId].CategoryType,

            SubCategoryCode = x.SubCategoryId == null ? string.Empty : subCategoriesDict[x.SubCategoryId.GetValueOrDefault()].SubCategoryCode,
            SubCategoryName = x.SubCategoryId == null ? string.Empty : subCategoriesDict[x.SubCategoryId.GetValueOrDefault()].SubCategoryName
        }).ToList());
    }


    [Route("{transactionId}")]
    [HttpGet]
    public async Task<ActionResult<TransactionReadDto>> Get([FromRoute]long transactionId)
    {
        if(transactionId != null)
        {
            Transaction foundTransaction = await _context.Transactions.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.UserId == _currentUserId && x.TransactionId == transactionId);

            if(foundTransaction == null)
            {
                return BadRequest("No Transaction Found");
            }

            Category category = await _context.Categories.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.CategoryId == foundTransaction.CategoryId);

            if(category == null)
            {
                return BadRequest("Transaction with no category found");
            }

            SubCategory subCategory = await _context.SubCategories.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.CategoryId == foundTransaction.CategoryId && x.SubCategoryId == foundTransaction.SubCategoryId);

            TransactionReadDto readDto = new TransactionReadDto(){
                TransactionId = foundTransaction.TransactionId,
                CategoryId = foundTransaction.CategoryId,
                CategoryCode = category.CategoryCode,
                CategoryName = category.CategoryName,
                CategoryType = category.CategoryType,

                SubCategoryId = foundTransaction.SubCategoryId,
                SubCategoryCode = subCategory == null ? string.Empty : subCategory.SubCategoryCode,
                SubCategoryName = subCategory == null ? string.Empty :  subCategory.SubCategoryName,

                Amount = foundTransaction.Amount,
                Note = foundTransaction.Note,
                TransactionDate = foundTransaction.TransactionDate
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    
    public async Task<ActionResult<TransactionReadDto>> Post([FromBody]TransactionCreateDto createDto)
    {
        Console.WriteLine(JsonSerializer.Serialize(createDto));
        if(createDto != null)
        {
            List<string> errors = new List<string>();

            if(!await _context.Categories.AnyAsync(x => x.ClientId == _currentClientId && x.CategoryId == createDto.CategoryId))
            {
                errors.Add("Category does not exist");
            }

            if(createDto.SubCategoryId != null)
            {
                if(!await _context.SubCategories.AnyAsync(x => x.ClientId == _currentClientId && x.CategoryId == createDto.CategoryId && x.SubCategoryId == createDto.SubCategoryId.GetValueOrDefault()))
                {
                    errors.Add("Sub Category does not exist");
                }
            }

            if(errors.Any())
                return BadRequest(errors);

            Transaction newTransaction = new Transaction(){
                CategoryId = createDto.CategoryId,
                SubCategoryId = createDto.SubCategoryId,
                Amount = createDto.Amount,
                Note = createDto.Note,
                TransactionDate = createDto.TransactionDate,
                ClientId = _currentClientId,
                UserId = _currentUserId,
                CreatedBy = _currentUserId,
                CreatedDate = DateTime.Now,
                UpdatedBy = _currentUserId,
                UpdatedDate = DateTime.Now
            };

            await _context.Transactions.AddAsync(newTransaction);
            _context.SaveChanges();

            TransactionReadDto readDto = new TransactionReadDto(){
                TransactionId = newTransaction.TransactionId,
                CategoryId = newTransaction.CategoryId,
                Amount = newTransaction.Amount,
                Note = newTransaction.Note,
                // Category = newTransaction.Category
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [Route("{transactionId}")]
    [HttpPut(Name = "PutTransaction`")]
    public async Task<ActionResult<TransactionReadDto>> Put([FromRoute] long transactionId, [FromBody]TransactionCreateDto createDto)
    {
        if(createDto != null)
        {
            List<string> errors = new List<string>();

            if(!await _context.Categories.AnyAsync(x => x.ClientId == _currentClientId && x.CategoryId == createDto.CategoryId))
            {
                errors.Add("Category does not exist");
            }

            if(createDto.SubCategoryId != null)
            {
                if(!await _context.SubCategories.AnyAsync(x => x.ClientId == _currentClientId && x.CategoryId == createDto.CategoryId && x.SubCategoryId == createDto.SubCategoryId.GetValueOrDefault()))
                {
                    errors.Add("Sub Category does not exist");
                }
            }

            if(errors.Any())
                return BadRequest(errors);
            
            Transaction foundTransaction = await _context.Transactions.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.UserId == _currentUserId && x.TransactionId == transactionId);

            if(foundTransaction == null)
                return BadRequest("No Transaction Found");

            foundTransaction.Amount = createDto.Amount;
            foundTransaction.Note = createDto.Note;
            foundTransaction.TransactionDate = createDto.TransactionDate;
            foundTransaction.CategoryId = createDto.CategoryId;
            foundTransaction.SubCategoryId = createDto.SubCategoryId;
            foundTransaction.UpdatedBy = _currentUserId;
            foundTransaction.UpdatedDate = DateTime.Now;

            _context.Transactions.Update(foundTransaction);
            _context.SaveChanges();

            TransactionReadDto readDto = new TransactionReadDto(){
                TransactionId = foundTransaction.TransactionId,
                CategoryId = foundTransaction.CategoryId,
                Amount = foundTransaction.Amount,
                Note = foundTransaction.Note,
                // Category = newTransaction.Category
            };

            return Ok(readDto);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }


    [HttpDelete]
    [Route("{transactionId}")]
    public async Task<ActionResult<bool>> Delete([FromRoute]long transactionId)
    {
        if(transactionId != null)
        {
            Transaction foundTransaction = await _context.Transactions.FirstOrDefaultAsync(x => x.ClientId == _currentClientId && x.UserId == _currentUserId && x.TransactionId == transactionId);

            if(foundTransaction == null)
            {
                return BadRequest("No Transaction Found");
            }

            _context.Transactions.Remove(foundTransaction);
            _context.SaveChanges();


            return Ok(true);
        }
        else{
            return BadRequest("No Data Provided");
        }
    }



}
