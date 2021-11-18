using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Forms;
using Wowthing.Web.Models;
using Wowthing.Web.Models.Search;
using Wowthing.Web.Models.Team;
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

        [HttpPost("item-search")]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ItemSearch([FromBody] ApiItemSearchForm form)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
            {
                return NotFound();
            }

            var parts = form.Terms.Split(' ', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 0)
            {
                return BadRequest();
            }

            var itemQuery = _context.WowItem.AsQueryable();
            foreach (string part in parts)
            {
                // Alias to avoid variable capture bullshit
                string temp = part;
                itemQuery = itemQuery.Where(item => EF.Functions.ILike(item.Name, $"%{temp}%"));
            }

            var items = await itemQuery
                .Distinct()
                //.OrderByDescending(item => item.Id)
                //.Take(100)
                .ToArrayAsync();

            if (items.Length == 0)
            {
                return Json(new string[] { });
            }

            var itemIds = items.Select(item => item.Id).ToArray();
            var itemMap = items.ToDictionary(item => item.Id, item => item.Name);

            var characterItems = await _context.PlayerCharacterItem
                .Where(pci => pci.Character.Account.UserId == user.Id)
                .Where(pci => itemIds.Contains(pci.ItemId))
                .ToArrayAsync();

            var ret = characterItems.GroupBy(pci => pci.ItemId)
                .Select(group => new ItemSearchResponseItem
                {
                    ItemId = group.Key,
                    ItemName = itemMap[group.Key],
                    Characters = group.Select(result => new ItemSearchResponseCharacter
                    {
                        CharacterId = result.CharacterId,
                        Count = result.Count,
                        Location = result.Location,
                        ItemLevel = result.ItemLevel,
                        Quality = result.Quality,
                        Context = result.Context > 0 ? result.Context : null,
                        EnchantId = result.EnchantId > 0 ? result.EnchantId : null,
                        SuffixId = result.SuffixId > 0 ? result.SuffixId : null,
                        BonusIds = result.BonusIds,
                        Gems = result.Gems,
                    }).ToList()
                })
                .OrderBy(item => item.ItemName)
                .ToList();
            
            /*var results = await ItemSearchQuery.ExecuteAsync(_context, user.Id, itemIds);
            var ret = results.GroupBy(result => result.ItemId)
                .Select(group => new ItemSearchResponseItem
                {
                    ItemId = group.Key,
                    ItemName = itemMap[group.Key],
                    Characters = group.Select(result => new ItemSearchResponseCharacter
                    {
                        CharacterId = result.CharacterId,
                        Count = result.Count,
                        Location = result.Location,
                    }).ToList()
                })
                .OrderBy(item => item.ItemName)
                .ToList();*/
            
            return Json(ret);
        }

        [HttpPost("settings")]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Settings([FromBody] ApiSettingsForm form)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
            {
                return NotFound("User does not exist");
            }

            form.Settings.Validate();
            user.Settings = form.Settings;
            
            await _userManager.UpdateAsync(user);

            var accountMap = await _context.PlayerAccount
                .Where(pa => pa.UserId == user.Id)
                .ToDictionaryAsync(pa => pa.Id);

            foreach (var (accountId, accountData) in form.Accounts)
            {
                if (accountMap.TryGetValue(accountId, out var account))
                {
                    account.Enabled = accountData.Enabled;
                    account.Tag = accountData.Tag.Truncate(4);
                }
            }

            await _context.SaveChangesAsync();
            
            return Json(new
            {
                Accounts = accountMap.Values.ToList(),
                Settings = form.Settings,
            });
        }

        [HttpGet("{type:regex(^(achievement|static|transmog|zone-map)$)}.{hash:length(32)}.json")]
        [ResponseCache(Duration = 365 * 24 * 60 * 60, VaryByHeader = "Origin")]
        public async Task<IActionResult> CachedJson([FromRoute] string type, [FromRoute] string hash)
        {
            var db = _redis.GetDatabase();

            string jsonHash = await db.StringGetAsync($"cache:{type}:hash");
            if (hash != jsonHash)
            {
                return RedirectToAction("CachedJson", new { type, hash = jsonHash });
            }

            return Content(await db.StringGetAsync($"cache:{type}:data"), "application/json");
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

            var data = new TeamApi(team);

            return Ok(data);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromBody] ApiUpload apiUpload)
        {
            // TODO rate limit
            if (apiUpload?.ApiKey == null || apiUpload.LuaFile == null)
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

            var apiResult = await CheckUser(username);
            if (apiResult.NotFound)
            {
                return NotFound();
            }

            timer.AddPoint("CheckUser");

            var db = _redis.GetDatabase();

            // Update user last visit
            if (!apiResult.Public)
            {
                apiResult.User.LastVisit = DateTime.Now;
                await _userManager.UpdateAsync(apiResult.User);
            }

            // Retrieve data
            var accounts = new List<PlayerAccount>();
            var tempAccounts = await _context.PlayerAccount
                .Where(a => a.UserId == apiResult.User.Id)
                .ToListAsync();

            if (!apiResult.Public)
            {
                accounts = tempAccounts;
            }

            timer.AddPoint("Get accounts");

            var characterQuery = _context.PlayerCharacter
                .Where(c => c.Account.UserId == apiResult.User.Id);
            if (apiResult.Public)
            {
                characterQuery = characterQuery.Where(c => c.Level >= 11);
            }

            // Privacy checks
            characterQuery = characterQuery
                .Include(c => c.EquippedItems)
                .Include(c => c.Reputations)
                .Include(c => c.Shadowlands)
                .Include(c => c.Weekly);

            if (!apiResult.Public || apiResult.Privacy.PublicCurrencies)
            {
                characterQuery = characterQuery
                    .Include(c => c.Currencies);
            }

            if (!apiResult.Public || apiResult.Privacy.PublicLockouts)
            {
                characterQuery = characterQuery
                    .Include(c => c.Lockouts);
            }
            
            if (!apiResult.Public || apiResult.Privacy.PublicMythicPlus)
            {
                characterQuery = characterQuery
                    .Include(c => c.MythicPlus)
                    .Include(c => c.MythicPlusAddon)
                    .Include(c => c.MythicPlusSeasons)
                    .Include(c => c.RaiderIo);
            }

            /*if (apiResult.User.Settings?.Privacy?.PublicTransmog == true)
            {
                characterQuery = characterQuery.Include(c => c.Currencies);
            }*/

            var characters = await characterQuery
                .AsNoTracking()
                .AsSplitQuery()
                .ToArrayAsync();

            timer.AddPoint("characterQuery");

            var currentPeriods = _context.WowPeriod
                .AsEnumerable()
                .GroupBy(p => p.Region)
                .ToDictionary(
                    grp => (int)grp.Key,
                    grp => grp.OrderByDescending(p => p.Starts).First()
                );

            var now = DateTime.UtcNow;
            foreach (var region in currentPeriods.Keys)
            {
                while (currentPeriods[region].Ends < now)
                {
                    currentPeriods[region].Id++;
                    currentPeriods[region].Starts = currentPeriods[region].Starts.AddDays(7);
                    currentPeriods[region].Ends = currentPeriods[region].Ends.AddDays(7);
                }
            }

            timer.AddPoint("currentPeriods");

            // Build response
            var apiData = new UserApi
            {
                Accounts = accounts.ToDictionary(k => k.Id, v => new UserApiAccount(v)),
                Characters = characters.Select(character => new UserApiCharacter(character, apiResult.Public, apiResult.Privacy)).ToList(),
                CurrentPeriod = currentPeriods,
                Public = apiResult.Public,
            };

            timer.AddPoint("Build response", true);
            _logger.LogDebug($"{timer}");

            return Ok(apiData);
        }

        [HttpGet("user/{username:username}/achievements")]
        public async Task<IActionResult> UserAchievementData([FromRoute] string username)
        {
            var timer = new JankTimer();

            var apiResult = await CheckUser(username);
            if (apiResult.NotFound)
            {
                return NotFound();
            }

            timer.AddPoint("CheckUser");

            var achievementsCompleted = await _context.CompletedAchievementsQuery
                .FromSqlRaw(CompletedAchievementsQuery.USER_QUERY, apiResult.User.Id)
                .ToDictionaryAsync(k => k.AchievementId, v => v.Timestamp);
            
            timer.AddPoint("Get Achievements");

            var criteria = await _context.AchievementCriteriaQuery
                .FromSqlRaw(AchievementCriteriaQuery.USER_QUERY, apiResult.User.Id)
                .ToArrayAsync();
            var groupedCriteria = criteria
                .GroupBy(c => c.CriteriaId)
                .ToDictionary(
                    g => g.Key,
                    g => g
                        .OrderByDescending(c => c.Amount)
                        .ThenBy(c => c.CharacterId)
                        .Select(c => new int[] { c.CharacterId, (int)c.Amount })
                        .ToList()
                );
            
            timer.AddPoint("Get Criteria");

            // Build response
            var data = new UserAchievementData
            {
                Achievements = achievementsCompleted,
                Criteria = groupedCriteria,
            };
            
            timer.AddPoint("Build response", true);
            _logger.LogDebug($"{timer}");

            return Ok(data);
        }

        [HttpGet("user/{username:username}/collections")]
        public async Task<IActionResult> UserCollectionData([FromRoute] string username)
        {
            var timer = new JankTimer();

            var apiResult = await CheckUser(username);
            if (apiResult.NotFound)
            {
                return NotFound();
            }

            timer.AddPoint("CheckUser");

            var accounts = await _context.PlayerAccount
                .Where(pa => pa.UserId == apiResult.User.Id)
                .Include(pa => pa.Pets)
                .Include(pa => pa.Toys)
                .ToArrayAsync();

            timer.AddPoint("Accounts");
            
            var mounts = await _context.MountQuery
                .FromSqlRaw(MountQuery.USER_QUERY, apiResult.User.Id)
                .FirstAsync();
            
            timer.AddPoint("Mounts");
            
            var accountPets = accounts
                .Where(pa => pa.Pets != null)
                .Select(pa => pa.Pets)
                .OrderByDescending(pap => pap.UpdatedAt)
                .ToArray();
            
            timer.AddPoint("Pets");

            var toyIds = accounts
                .SelectMany(a => a.Toys?.ToyIds ?? Enumerable.Empty<int>())
                .Distinct()
                .ToArray();
            
            timer.AddPoint("Toys");

            // Build response
            var allPets = new Dictionary<long, PlayerAccountPetsPet>();
            foreach (var pets in accountPets)
            {
                foreach (var (petId, pet) in pets.Pets)
                {
                    allPets.TryAdd(petId, pet);
                }
            }

            var data = new UserCollectionData
            {
                MountsPacked = SerializationUtilities.SerializeUInt16Array(mounts.Mounts
                    .EmptyIfNull()
                    .Select(m => (ushort)m).ToArray()),
                ToysPacked = SerializationUtilities.SerializeInt32Array(toyIds),
                
                AddonMounts = mounts.AddonMounts
                    .EmptyIfNull()
                    .ToDictionary(m => m, m => true),
                Pets = allPets
                    .Values
                    .GroupBy(pet => pet.SpeciesId)
                    .ToDictionary(
                        group => group.Key,
                        group => group
                            .OrderByDescending(pet => pet.Level)
                            .ThenByDescending(pet => (int)pet.Quality)
                            .Select(pet => new UserPetDataPet(pet))
                            .ToList()
                    ),
            };
            
            timer.AddPoint("Build response", true);
            _logger.LogDebug($"{timer}");

            return Ok(data);
        }
        
        [HttpGet("user/{username:username}/quests")]
        public async Task<IActionResult> UserQuestData([FromRoute] string username)
        {
            var timer = new JankTimer();

            var apiResult = await CheckUser(username);
            if (apiResult.NotFound)
            {
                return NotFound();
            }

            timer.AddPoint("CheckUser");


            Dictionary<int, UserQuestDataCharacter> characterData = new();
            
            if (!apiResult.Public || apiResult.Privacy.PublicQuests)
            {
                var characters = await _context.PlayerCharacter
                    .Where(pc => pc.Account.UserId == apiResult.User.Id)
                    .Include(pc => pc.AddonQuests)
                    .Include(pc => pc.Quests)
                    .Select(pc => new
                    {
                        pc.Id,
                        pc.AddonQuests,
                        pc.Quests,
                    })
                    .ToArrayAsync();
                
                characterData = characters.ToDictionary(
                    c => c.Id,
                    c => new UserQuestDataCharacter
                    {
                        ScannedAt = c.AddonQuests?.ScannedAt ?? DateTime.MinValue,
                        DailyQuestsPacked = c.AddonQuests?.DailyQuests.EmptyIfNull().ToPackedUInt16Array(),
                        QuestsPacked = c.Quests?.CompletedIds.EmptyIfNull().ToPackedUInt16Array(),
                    }
                );
            }

            timer.AddPoint("Get quests");

            // Build response
            var data = new UserQuestData
            {
                Characters = characterData,
            };
            
            timer.AddPoint("Build response", true);
            _logger.LogDebug($"{timer}");

            return Ok(data);
        }
        
        [HttpGet("user/{username:username}/transmog")]
        public async Task<IActionResult> UserTransmogData([FromRoute] string username)
        {
            var timer = new JankTimer();

            var apiResult = await CheckUser(username);
            if (apiResult.NotFound)
            {
                return NotFound();
            }

            timer.AddPoint("CheckUser");

            var allTransmog = await _context.AccountTransmogQuery
                .FromSqlRaw(AccountTransmogQuery.SQL, apiResult.User.Id)
                .FirstAsync();
            
            timer.AddPoint("Get Transmog");

            // Build response
            var data = new UserTransmogData
            {
                Transmog = allTransmog.TransmogIds,
            };
            
            timer.AddPoint("Build response", true);
            _logger.LogDebug($"{timer}");

            return Ok(data);
        }

        private async Task<ApiUserResult> CheckUser(string username)
        {
            var ret = new ApiUserResult();
            
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                ret.NotFound = true;
                return ret;
            }

            ret.Public = User?.Identity?.Name != user.UserName;
            ret.Privacy = user.Settings?.Privacy ?? new ApplicationUserSettingsPrivacy();

            if (ret.Public && ret.Privacy.Public != true)
            {
                ret.NotFound = true;
                return ret;
            }
            
            ret.User = user;
            return ret;
        }
        
        private class ApiUserResult
        {
            public bool NotFound { get; set; }
            public bool Public { get; set; }
            public ApplicationUser User { get; set; }
            public ApplicationUserSettingsPrivacy Privacy { get; set; }
        }
    }
}
