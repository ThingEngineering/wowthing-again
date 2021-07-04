﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Models;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly ILogger<ApiController> _logger;
        private readonly UploadService _uploadService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowDbContext _context;
        
        public ApiController(IConnectionMultiplexer redis, ILogger<ApiController> logger, UploadService uploadService, UserManager<ApplicationUser> userManager, WowDbContext context)
        {
            _redis = redis;
            _logger = logger;
            _uploadService = uploadService;
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("api-key-get")]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ApiKeyGet()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
            {
                return NotFound();
            }

            if (string.IsNullOrWhiteSpace(user.ApiKey))
            {
                user.GenerateApiKey();
                await _userManager.UpdateAsync(user);
            }

            return Json(new { key = user.ApiKey });
        }

        [HttpPost("api-key-reset")]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ApiKeyReset()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
            {
                return NotFound();
            }

            user.GenerateApiKey();
            await _userManager.UpdateAsync(user);

            return Json(new { key = user.ApiKey });
        }

        [HttpPost("settings")]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Settings([FromBody] ApplicationUserSettings settings)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
            {
                return NotFound("User does not exist");
            }

            user.Settings = settings;
            await _userManager.UpdateAsync(user);

            return Ok();
        }

        [HttpGet("static.{hash:length(32)}.json")]
        [ResponseCache(Duration = 365 * 24 * 60 * 60)]
        public async Task<IActionResult> StaticData([FromRoute] string hash)
        {
            var db = _redis.GetDatabase();

            string jsonHash = await db.StringGetAsync("cached_static:hash");
            if (hash != jsonHash)
            {
                return NotFound("Invalid static data hash");
            }

            return Content(await db.StringGetAsync("cached_static:data"), "application/json");
        }

        [HttpGet("team/{guid:guid}")]
        public async Task<IActionResult> TeamData([FromRoute] Guid guid)
        {
            var team = await _context.Team
                .Include(t => t.Characters)
                    .ThenInclude(c => c.Character)
                    .ThenInclude(c => c.EquippedItems)
                .FirstOrDefaultAsync(t => t.Guid == guid);
            if (team == null)
            {
                return NotFound("Team not found");
            }

            var data = new TeamApi(_context, team);

            return Ok(data);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromBody] ApiUpload apiUpload)
        {
            // TODO rate limit
            if (apiUpload?.ApiKey == null || apiUpload?.LuaFile == null)
            {
                _logger.LogDebug("Upload: {0}", JsonConvert.SerializeObject(apiUpload));
                return BadRequest("Invalid request format");
            }
            
            if (apiUpload.ApiKey.Length != ApplicationUser.API_KEY_LENGTH * 2)
            {
                return BadRequest("Invalid API key format");
            }

            var user = await _context.ApplicationUser
                .Where(u => u.ApiKey == apiUpload.ApiKey)
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return StatusCode((int) HttpStatusCode.Forbidden, "Invalid API key");
            }

            await _uploadService.Process(user.Id, apiUpload.LuaFile);

            return Ok("Upload accepted");
        }
        
        [HttpGet("user/{username:username}")]
        public async Task<IActionResult> UserData([FromRoute] string username)
        {
            var timer = new JankTimer();

            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            timer.AddPoint("Find user");

            if (User.Identity.Name != user.UserName && !user.Settings.Privacy.Public)
            {
                return NotFound();
            }

            timer.AddPoint("Privacy");

            var db = _redis.GetDatabase();
            bool pub = User.Identity.Name != user.UserName;
            bool anon = user.Settings.Privacy.Anonymized;

            // Retrieve data
            var mountIds = await db.GetSetMembersAsync(string.Format(RedisKeys.UserMounts, user.Id));
            
            timer.AddPoint("Get mounts");

            List<PlayerAccount> accounts = new List<PlayerAccount>();
            var tempAccounts = await _context.PlayerAccount
                .Where(a => a.UserId == user.Id)
                .Include(a => a.Toys)
                .ToListAsync();

            var toyIds = tempAccounts
                .SelectMany(a => a.Toys?.ToyIds ?? Enumerable.Empty<int>())
                .Distinct();

            if (!pub)
            {
                accounts = tempAccounts;
            }

            timer.AddPoint("Get accounts");

            var characterQuery = _context.PlayerCharacter
                .Where(c => c.Account.UserId == user.Id);
            if (pub)
            {
                characterQuery = characterQuery.Where(c => c.Level >= 11);
            }

            var characters = await characterQuery
                .Include(c => c.Currencies)
                .Include(c => c.EquippedItems)
                .Include(c => c.Lockouts)
                .Include(c => c.MythicPlus)
                .Include(c => c.MythicPlusSeasons)
                .Include(c => c.Quests)
                .Include(c => c.RaiderIo)
                .Include(c => c.Reputations)
                .Include(c => c.Shadowlands)
                .Include(c => c.Weekly)
                .AsNoTracking()
                .AsSplitQuery()
                .ToArrayAsync();

            timer.AddPoint("characterQuery");

            var currentPeriods = await _context.WowPeriod
                    .Where(p => p.Starts <= DateTime.UtcNow && p.Ends > DateTime.UtcNow)
                    .ToDictionaryAsync(k => (int)k.Region);

            timer.AddPoint("currentPeriods");

            // Build response
            var mountMap = mountIds.ToDictionary(k => int.Parse(k), v => 1);
            var toyMap = toyIds.ToDictionary(k => k, v => 1);

            var apiData = new UserApi
            {
                Accounts = accounts.ToDictionary(k => k.Id, v => new UserApiAccount(v)),
                Characters = characters.Select(character => new UserApiCharacter(character, pub, anon)).ToList(),
                CurrentPeriod = currentPeriods,
                Mounts = mountMap,
                Public = pub,
                Toys = toyMap,
            };

            timer.AddPoint("Build response", true);
            _logger.LogDebug($"{timer}");

            return Ok(apiData);
        }
    }
}
