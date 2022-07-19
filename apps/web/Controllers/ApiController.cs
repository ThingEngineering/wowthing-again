using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Forms;
using Wowthing.Web.Models;
using Wowthing.Web.Models.Search;
using Wowthing.Web.Models.Team;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers;

[Route("api")]
public class ApiController : Controller
{
    private readonly CacheService _cacheService;
    private readonly IConnectionMultiplexer _redis;
    private readonly ILogger<ApiController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly UserService _userService;
    private readonly WowDbContext _context;

    public ApiController(
        CacheService cacheService,
        IConnectionMultiplexer redis,
        ILogger<ApiController> logger,
        UserManager<ApplicationUser> userManager,
        UserService userService,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _redis = redis;
        _logger = logger;
        _userManager = userManager;
        _userService = userService;
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

        var itemQuery = _context.LanguageString
            .Where(ls => ls.Language == user.Settings.General.Language && ls.Type == StringType.WowItemName);
        foreach (string part in parts)
        {
            // Alias to avoid variable capture bullshit
            string temp = part;
            itemQuery = itemQuery.Where(item => EF.Functions.ILike(item.String, $"%{temp}%"));
        }

        var items = await itemQuery
            .Select(ls => new { ls.Id, ls.String })
            .Distinct()
            //.Take(100)
            .ToArrayAsync();

        if (items.Length == 0)
        {
            return Json(Array.Empty<string>());
        }

        var itemIds = items.Select(item => item.Id).ToArray();
        var itemMap = items.ToDictionary(item => item.Id, item => item.String);

        var characterItems = await _context.PlayerCharacterItem
            .Where(pci => pci.Character.Account.UserId == user.Id)
            .Where(pci => itemIds.Contains(pci.ItemId))
            .ToArrayAsync();

        var ret = characterItems
            .GroupBy(pci => pci.ItemId)
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

        form.Settings.Migrate();
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

    [HttpGet("user/{username:username}")]
    public async Task<IActionResult> UserData([FromRoute] string username)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        timer.AddPoint("CheckUser");

        var (isModified, lastModified) =
            await _cacheService.CheckLastModified(RedisKeys.UserLastModifiedGeneral, Request, apiResult);
        if (!isModified)
        {
            return StatusCode((int)HttpStatusCode.NotModified);
        }

        timer.AddPoint("LastModified");

        // Update user last visit
        // if (!apiResult.Public)
        // {
        //     apiResult.User.LastVisit = DateTime.UtcNow;
        //     await _userManager.UpdateAsync(apiResult.User);
        // }

        // Retrieve data
        var accounts = new List<PlayerAccount>();
        var tempAccounts = await _context.PlayerAccount
            .AsNoTracking()
            .Where(a => a.UserId == apiResult.User.Id)
            .Include(pa => pa.Pets)
            .Include(pa => pa.Toys)
            .ToListAsync();

        if (!apiResult.Public || apiResult.Privacy.PublicAccounts)
        {
            accounts = tempAccounts;
        }

        timer.AddPoint("Accounts");

        var characterQuery = _context.PlayerCharacter
            .Where(c => c.Account.UserId == apiResult.User.Id)
            .Where(c => c.Level > 0);
        if (apiResult.Public)
        {
            characterQuery = characterQuery.Where(c => c.Level >= 11);
        }

        // Privacy checks
        characterQuery = characterQuery
            .Include(c => c.AddonData)
            .Include(c => c.EquippedItems)
            .Include(c => c.Professions)
            .Include(c => c.Reputations)
            .Include(c => c.Shadowlands)
            .Include(c => c.Specializations)
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

        var characterIds = characters
            .Select(character => character.Id)
            .ToArray();

        // Bags
        var bagItems = Array.Empty<PlayerCharacterItem>();
        if (!apiResult.Public)
        {
            bagItems = await _context.PlayerCharacterItem
                .AsNoTracking()
                .Where(pci => characterIds.Contains(pci.CharacterId) && pci.Slot == 0)
                .ToArrayAsync();
        }

        // Progress items
        var progressItems = await _context.PlayerCharacterItem
            .AsNoTracking()
            .Where(pci => characterIds.Contains(pci.CharacterId) && Hardcoded.ProgressItemIds.Contains(pci.ItemId))
            .ToArrayAsync();

        timer.AddPoint("Characters");

        var globalDailies = await _context.GlobalDailies
            .ToDictionaryAsync(gd => $"{gd.Expansion}-{(int)gd.Region}");

        var gdItemIds = new HashSet<int>();
        foreach (var gd in globalDailies.Values)
        {
            foreach (var questReward in gd.QuestRewards.EmptyIfNull())
            {
                if (questReward.ItemId > 0)
                {
                    gdItemIds.Add(questReward.ItemId);
                }
            }
        }

        Dictionary<int, string> gdItems = null;
        if (gdItemIds.Count > 0)
        {
            gdItems = await _context.LanguageString
                .Where(ls => ls.Language == apiResult.User.Settings.General.Language &&
                             ls.Type == StringType.WowItemName &&
                             gdItemIds.Contains(ls.Id))
                .ToDictionaryAsync(
                    ls => ls.Id,
                    ls => ls.String
                );
        }

        timer.AddPoint("Dailies");

        var backgrounds = await _context.BackgroundImage
            .Where(bi => bi.Role == null)
            .ToDictionaryAsync(bi => bi.Id);

        var images = await _context.Image
            .Where(image =>
                (image.Type == ImageType.Character || image.Type == ImageType.CharacterFull) &&
                characterIds.Contains(image.Id)
            )
            .ToDictionaryAsync(
                image => $"{image.Id.ToString()}-{((int)image.Type).ToString()}",
                image => image.Url
            );

        timer.AddPoint("Images");

        var currentPeriods = _context.WowPeriod
            .AsEnumerable()
            .GroupBy(p => p.Region)
            .ToDictionary(
                grp => (int)grp.Key,
                grp => grp
                    .OrderByDescending(p => p.Starts)
                    .First()
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

        timer.AddPoint("Periods");

        // Mounts
        var mounts = await _context.MountQuery
            .FromSqlRaw(MountQuery.UserQuery, apiResult.User.Id)
            .FirstAsync();

        timer.AddPoint("Mounts");

        // Pets
        var accountPets = tempAccounts
            .Where(pa => pa.Pets != null)
            .Select(pa => pa.Pets)
            .OrderByDescending(pap => pap.UpdatedAt)
            .ToArray();

        var allPets = new Dictionary<long, PlayerAccountPetsPet>();
        foreach (var pets in accountPets)
        {
            foreach (var (petId, pet) in pets.Pets)
            {
                allPets.TryAdd(petId, pet);
            }
        }

        timer.AddPoint("Pets");

        // Toys
        var toyIds = tempAccounts
            .SelectMany(a => a.Toys?.ToyIds ?? Enumerable.Empty<int>())
            .Distinct()
            .ToArray();

        timer.AddPoint("Toys");

        // Build response
        var apiData = new UserApi
        {
            Accounts = accounts.ToDictionary(k => k.Id, v => new UserApiAccount(v)),
            Characters = characters
                .Select(character => new UserApiCharacter(
                    character,
                    bagItems.Where(bi => bi.CharacterId == character.Id),
                    progressItems.Where(pi => pi.CharacterId == character.Id),
                    apiResult.Public,
                    apiResult.Privacy))
                .ToList(),

            GoldHistoryRealms = apiResult.Public ? null : await _context.PlayerAccountGoldSnapshot
                .Where(pags => tempAccounts.Select(account => account.Id).Contains(pags.AccountId))
                .Select(pags => pags.RealmId)
                .Distinct()
                .ToListAsync(),

            LastApiCheck = apiResult.Public ? null : apiResult.User.LastApiCheck,

            Backgrounds = backgrounds,
            CurrentPeriod = currentPeriods,
            GlobalDailies = globalDailies,
            GlobalDailyItems = gdItems,
            Images = images,
            Public = apiResult.Public,

            AddonMounts = mounts.AddonMounts
                .EmptyIfNull()
                .ToDictionary(m => m, _ => true),

            MountsPacked = SerializationUtilities.SerializeUInt16Array(mounts.Mounts
                .EmptyIfNull()
                .Select(m => (ushort)m).ToArray()),

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

            ToysPacked = SerializationUtilities.SerializeInt32Array(toyIds),
        };
        var json = JsonConvert.SerializeObject(apiData);

        timer.AddPoint("Build", true);
        _logger.LogDebug("{Timer}", timer);

        if (lastModified > DateTimeOffset.MinValue)
        {
            Response.AddApiCacheHeaders(apiResult.Public, lastModified);
        }

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpGet("user/{username:username}/history")]
    public async Task<IActionResult> UserHistoryData([FromRoute] string username)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        if (apiResult.Public)
        {
            return Forbid();
        }

        timer.AddPoint("CheckUser");

        var hiddenRealmIds = apiResult.User.Settings.History?.HiddenRealms ?? new List<int>();

        var rawData = await _context.PlayerAccountGoldSnapshot
            .AsNoTracking()
            .Where(pags => pags.Account.UserId == apiResult.User.Id)
            .Where(pags => !hiddenRealmIds.Contains(pags.RealmId))
            .OrderBy(pags => pags.Time)
            .ToArrayAsync();

        var data = rawData
            .GroupBy(pags => pags.Time)
            .Select(group => new UserHistoryGold
                {
                    Time = group.Key,
                    Entries = group.Select(pags => new UserHistoryGoldEntry
                    {
                        AccountId = pags.AccountId,
                        RealmId = pags.RealmId,
                        Gold = pags.Gold,
                    }).ToArray(),
                }
            )
            .ToArray();

        timer.AddPoint("Database", true);
        _logger.LogDebug("{Timer}", timer);

        return Ok(new {
            GoldRaw = data,
        });
    }
}