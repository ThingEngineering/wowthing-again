using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ServiceStack.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Web.Models;

namespace Wowthing.Web.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly IRedisClientsManager _redis;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowDbContext _context;

        public ApiController(IRedisClientsManager redis, UserManager<ApplicationUser> userManager, WowDbContext context)
        {
            _redis = redis;
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("static.{hash:length(32)}.json")]
        [ResponseCache(Duration = 365 * 24 * 60 * 60)]
        public async Task<IActionResult> StaticData([FromRoute] string hash)
        {
            var db = await _redis.GetClientAsync();

            var jsonHash = await db.GetValueAsync("cached_static:hash");
            if (hash != jsonHash)
            {
                return NotFound();
            }

            return Content(await db.GetValueAsync("cached_static:data"), "application/json");
        }

        [HttpGet("user/{username:username}")]
        public async Task<IActionResult> UserData([FromRoute] string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            if (!user.Settings.Privacy.Public)
            {
                return NotFound();
            }

            bool pub = User.Identity.Name != user.UserName;
            bool anon = user.Settings.Privacy.Anonymized;

            // Retrieve data
            var characterQuery = _context.PlayerCharacter.Where(c => c.Account.UserId == user.Id);
            if (pub)
            {
                characterQuery = characterQuery.Where(c => c.Level >= 11);
            }

            // Build response
            var apiData = new UserApi
            {
                Characters = characterQuery.Select(c => new UserApiCharacter(c, pub, anon)).ToList(),
            };


            return Ok(apiData);
        }
    }
}
