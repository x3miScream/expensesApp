using Microsoft.AspNetCore.Mvc;
using Server.Entities;
using Server.Utils;

namespace Server.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult TestAttributeType()
        {
            string categoryDocType = MongoDocumentTypeAttributeReader.GetMongoDocumentType<Category>();
            string transactionDocType = MongoDocumentTypeAttributeReader.GetMongoDocumentType<Transaction>();

            return Ok();
        }


        [HttpGet]
        [Route("testPeriods")]
        public IActionResult TestPeriods()
        {
            int period = PeriodUtils.GetCurrentPeriod();

            DateTime start = PeriodUtils.GetPeriodStartDate(period);
            DateTime end = PeriodUtils.GetPeriodEndDate(period);

            return Ok(new { 
                CurrentPeriod = period,
                StartDate = start,
                EndDate = end
            });
        }
    }
}
