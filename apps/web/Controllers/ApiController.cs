using System.Net.Mime;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Forms;
using Wowthing.Web.Models;
using Wowthing.Web.Models.Api.User;
using Wowthing.Web.Models.Team;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers;

[Route("api")]
public class ApiController : Controller
{
    private readonly CacheService _cacheService;
    private readonly ILogger<ApiController> _logger;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly UserService _userService;
    private readonly WowDbContext _context;

    public ApiController(
        CacheService cacheService,
        ILogger<ApiController> logger,
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        UserManager<ApplicationUser> userManager,
        UserService userService,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _logger = logger;
        _jsonSerializerOptions = jsonSerializerOptions;
        _memoryCacheService = memoryCacheService;
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

        _logger.LogDebug("Resetting caches");
        _memoryCacheService.ExpireUserByName(user.UserName);
        await _cacheService.SetLastModified(RedisKeys.UserLastModifiedAchievements, user.Id);
        await _cacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, user.Id);
        await _cacheService.SetLastModified(RedisKeys.UserLastModifiedQuests, user.Id);
        //await _cacheService.SetLastModified(RedisKeys.UserLastModifiedTransmog, user.Id);

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

    [HttpGet("user/{username:username}/{access:regex(^public|private)}-{modified:long}.json")]
    public async Task<IActionResult> UserData([FromRoute] string username, [FromRoute] string access, [FromRoute] long modified)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        if (access == "private" && apiResult.Public)
        {
            return Forbid();
        }

        if (access == "public")
        {
            apiResult.Public = true;
        }

        timer.AddPoint("CheckUser");

        var (isModified, lastModified) =
            await _cacheService.CheckLastModified(RedisKeys.UserLastModifiedGeneral, null, apiResult);
        var lastUnix = lastModified.ToUnixTimeSeconds();
        if (lastUnix != modified)
        {
            return RedirectToAction("UserData", new { username, access, modified = lastUnix });
        }

        timer.AddPoint("LastModified");

        // Update user last visit
        if (!apiResult.Public)
        {
            await _context.Users
                .Where(au => au.Id == apiResult.User.Id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(au => au.LastVisit, au => DateTime.UtcNow)
                );
        }

        // Retrieve data
        var accounts = new List<PlayerAccount>();
        var tempAccounts = await _context.PlayerAccount
            .AsNoTracking()
            .Where(a => a.UserId == apiResult.User.Id)
            .Include(pa => pa.AddonData)
            .Include(pa => pa.Heirlooms)
            .Include(pa => pa.Pets)
            .Include(pa => pa.Toys)
            .ToListAsync();

        if (!apiResult.Public || apiResult.Privacy.PublicAccounts)
        {
            accounts = tempAccounts;
        }

        timer.AddPoint("Accounts");

        var guilds = await _context.PlayerGuild
            .Where(pg => pg.UserId == apiResult.User.Id)
            .ToArrayAsync();

        timer.AddPoint("Guilds");

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
            .Include(c => c.Configuration)
            .Include(c => c.EquippedItems)
            .Include(c => c.Professions)
            .Include(c => c.Reputations)
            .Include(c => c.Shadowlands)
            .Include(c => c.Specializations)
            .Include(c => c.Stats)
            .Include(c => c.Weekly);

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

        timer.AddPoint("Characters");

        // Bags
        var bagItems = (await _context.PlayerCharacterItem
                .AsNoTracking()
                .Where(pci => characterIds.Contains(pci.CharacterId) && pci.Slot == 0)
                .ToArrayAsync()
            ).ToGroupedDictionary(pci => pci.CharacterId);

        // Progress items
        var progressItems = (
                await _context.PlayerCharacterItem
                    .AsNoTracking()
                    .Where(pci => characterIds.Contains(pci.CharacterId) && Hardcoded.ProgressItemIds.Contains(pci.ItemId))
                    .ToArrayAsync()
            )
            .ToGroupedDictionary(pci => pci.CharacterId);

        // Currency items
        var currencyItems = (
                await _context.PlayerCharacterItem
                    .AsNoTracking()
                    .Where(pci =>
                        characterIds.Contains(pci.CharacterId) && Hardcoded.CurrencyItemIds.Contains(pci.ItemId))
                    .ToArrayAsync()
            )
            .ToGroupedDictionary(pci => pci.CharacterId);

        timer.AddPoint("Items");

        var globalDailies = await _context.GlobalDailies
            .ToDictionaryAsync(gd => $"{gd.Expansion}-{(int)gd.Region}");

        timer.AddPoint("Dailies");

        var backgrounds = await _memoryCacheService.GetBackgroundImages();

        var images = await _context.Image
            .Where(image =>
                (image.Type == ImageType.Character || image.Type == ImageType.CharacterFull) &&
                characterIds.Contains(image.Id)
            )
            .Select(image => new Image
            {
                Id = image.Id,
                Format = image.Format,
                Sha256 = image.Sha256,
                Type = image.Type,
            })
            .ToDictionaryAsync(
                image => $"{image.Id.ToString()}-{((int)image.Type).ToString()}",
                image => image.Url
            );

        timer.AddPoint("Images");

        var currentPeriods = await _memoryCacheService.GetPeriods();

        timer.AddPoint("Periods");

        // Heirlooms
        var heirlooms = new Dictionary<int, int>();
        foreach (var account in tempAccounts.Where(pa => pa.Heirlooms != null))
        {
            foreach ((int heirloomId, int upgradeLevel) in account.Heirlooms.Heirlooms)
            {
                heirlooms[heirloomId] = Math.Max(heirlooms.GetValueOrDefault(heirloomId), upgradeLevel);
            }
        }

        // Honor
        var maxHonorAccount = tempAccounts.MaxBy(pa => pa.AddonData?.HonorLevel);

        // Mounts
        var userCache = await _cacheService.CreateOrUpdateMountCacheAsync(
            _context, timer, apiResult.User.Id, lastModified);

        timer.AddPoint("Mounts");

        // Pets
        var accountPets = tempAccounts
            .Where(pa => pa.Enabled && pa.Pets != null)
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
        await _cacheService.CreateOrUpdateToyCacheAsync(
            _context, timer, apiResult.User.Id, lastModified, userCache);

        timer.AddPoint("Toys");

        List<int> goldHistoryRealms = null;
        if (!apiResult.Public)
        {
            goldHistoryRealms = await _context.PlayerAccountGoldSnapshot
                .Where(pags => tempAccounts.Select(account => account.Id).Contains(pags.AccountId))
                .Select(pags => pags.RealmId)
                .Distinct()
                .ToListAsync();
            timer.AddPoint("GoldHistory");
        }

        // RaiderIO
        var raiderIoScoreTiers = await _cacheService.GetRaiderIoTiers();
        timer.AddPoint("RaiderIO");

        // Objects
        var characterObjects = characters
            .Select(character => new ApiUserCharacter(
                character,
                bagItems.GetValueOrDefault(character.Id),
                currencyItems.GetValueOrDefault(character.Id),
                progressItems.GetValueOrDefault(character.Id),
                apiResult.Public,
                apiResult.Privacy))
            .ToList();

        var guildObjects = guilds
            .Select(guild => new ApiUserGuild(guild, apiResult.Public, apiResult.Privacy))
            .ToDictionary(guild => guild.Id);

        var petObjects = allPets
            .Values
            .GroupBy(pet => pet.SpeciesId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderByDescending(pet => pet.Level)
                    .ThenByDescending(pet => (int)pet.Quality)
                    .Select(pet => new UserPetDataPet(pet))
                    .ToList()
            );

        timer.AddPoint("Objects");

        // Build response
        var apiData = new ApiUser
        {
            Accounts = accounts.ToDictionary(k => k.Id, v => new ApiUserAccount(v)),
            Characters = characterObjects,
            Guilds = guildObjects,

            LastApiCheck = apiResult.Public ? null : apiResult.User.LastApiCheck,

            Backgrounds = backgrounds,
            CurrentPeriod = currentPeriods,
            GlobalDailies = globalDailies,
            GoldHistoryRealms = goldHistoryRealms,
            Heirlooms = heirlooms,
            HonorCurrent = maxHonorAccount?.AddonData?.HonorCurrent ?? 0,
            HonorLevel = maxHonorAccount?.AddonData?.HonorLevel ?? 0,
            HonorMax = maxHonorAccount?.AddonData?.HonorMax ?? 0,
            Images = images,
            Public = apiResult.Public,
            RaiderIoScoreTiers = raiderIoScoreTiers,

            PetsRaw = petObjects,

            MountsPacked = SerializationUtilities.SerializeUInt16Array(userCache.MountIds
                .EmptyIfNull()
                .Select(id => (ushort)id)
                .ToArray()
            ),

            ToysPacked = SerializationUtilities.SerializeUInt16Array(userCache.ToyIds
                .EmptyIfNull()
                .Select(id => (ushort)id)
                .ToArray()
            ),
        };
        var json = System.Text.Json.JsonSerializer.Serialize(apiData, _jsonSerializerOptions);

        timer.AddPoint("Build", true);
        _logger.LogInformation("{userId} | {userName} | {total} | {timer}",
            apiResult.User.Id, apiResult.User.UserName, timer.TotalDuration, timer);

        if (lastModified > DateTimeOffset.MinValue)
        {
            if (access == "private")
            {
                Response.AddApiCacheHeaders(false, lastModified);
            }
            else
            {
                Response.AddLongApiCacheHeaders(lastModified);
            }
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
