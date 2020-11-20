using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace Wowthing.Web.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly IConnectionMultiplexer _redis;

        public ApiController(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        [HttpGet("static.{hash:length(32)}.json")]
        [ResponseCache(Duration = 365 * 24 * 60 * 60)]
        public async Task<IActionResult> StaticData([FromRoute] string hash)
        {
            var db = _redis.GetDatabase();

            var dataWait = db.StringGetAsync("cached_static:data");
            var hashWait = db.StringGetAsync("cached_static:hash");
            string jsonData = await dataWait;
            string jsonHash = await hashWait;

            if (hash != jsonHash)
            {
                return NotFound();
            }

            // TODO set cache headers
            return Content(jsonData, "application/json");
        }
    }
}
