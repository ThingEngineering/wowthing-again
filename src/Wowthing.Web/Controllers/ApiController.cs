using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models;
using Wowthing.Web.Models;

namespace Wowthing.Web.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowDbContext _context;

        public ApiController(IConnectionMultiplexer redis, UserManager<ApplicationUser> userManager, WowDbContext context)
        {
            _redis = redis;
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("static.{hash:length(32)}.json")]
        [ResponseCache(Duration = 365 * 24 * 60 * 60)]
        public async Task<IActionResult> StaticData([FromRoute] string hash)
        {
            var db = _redis.GetDatabase();

            string jsonHash = await db.StringGetAsync("cached_static:hash");
            if (hash != jsonHash)
            {
                return NotFound();
            }

            return Content(await db.StringGetAsync("cached_static:data"), "application/json");
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

            var db = _redis.GetDatabase();
            bool pub = User.Identity.Name != user.UserName;
            bool anon = user.Settings.Privacy.Anonymized;

            // Retrieve data
            Dictionary<int, UserApiAccount> accounts = null;
            if (!pub)
            {
                accounts = await _context.PlayerAccount
                    .Where(a => a.UserId == user.Id)
                    .Select(a => new UserApiAccount(a))
                    .ToDictionaryAsync(a => a.Id);
            }

            var characterQuery = _context.PlayerCharacter
                .Where(c => c.Account.UserId == user.Id);
            if (pub)
            {
                characterQuery = characterQuery.Where(c => c.Level >= 11);
            }

            characterQuery = characterQuery
                .Include(c => c.Quests)
                .Include(c => c.Shadowlands);

            var mounts = await db.GetSetMembersAsync(string.Format(RedisKeys.UserMounts, user.Id));

            // Build response
            var apiData = new UserApi
            {
                Accounts = accounts,
                Characters = await characterQuery.Select(c => new UserApiCharacter(c, pub, anon)).ToListAsync(),
                Mounts = mounts.ToDictionary(k => k, v => 1),
            };

            return Ok(apiData);
        }
    }
}
