using System.Net.Mime;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Npgsql;
using NpgsqlTypes;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Forms;
using Wowthing.Web.Models;
using Wowthing.Web.Services;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Web.Controllers.API;

[Route("api/auctions")]
[AutoValidateAntiforgeryToken]
public class AuctionsController : Controller
{
    private readonly AuctionService _auctionService;
    private readonly CacheService _cacheService;
    private readonly ILogger<AuctionsController> _logger;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WowDbContext _context;

    public AuctionsController(
        AuctionService auctionService,
        CacheService cacheService,
        ILogger<AuctionsController> logger,
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        UserManager<ApplicationUser> userManager,
        WowDbContext context)
    {
        _auctionService = auctionService;
        _cacheService = cacheService;
        _logger = logger;
        _jsonSerializerOptions = jsonSerializerOptions;
        _memoryCacheService = memoryCacheService;
        _userManager = userManager;
        _context = context;
    }

    [HttpPost("browse")]
    public async Task<IActionResult> Browse([FromBody] ApiAuctionsBrowseForm form)
    {
        if (form.InventoryType <= 0 && form.ItemClass <= 0 && form.ItemSubclass <= 0)
        {
            return BadRequest();
        }

        var timer = new JankTimer();

        var data = await _auctionService.Browse(form.Region, form.DefaultFilter, form.InventoryType,
            form.ItemClass, form.ItemSubclass);

        timer.AddPoint("Data");

        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);
        _logger.LogInformation("{timer}", timer.ToString());

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("search")]
    public async Task<IActionResult> Search([FromBody] ApiAuctionsSearchForm form)
    {
        if (string.IsNullOrEmpty(form.Query) || form.Query.Trim().Length < 3)
        {
            return BadRequest();
        }

        var timer = new JankTimer();

        var data = await _auctionService.Search(form.Region, form.Query);

        timer.AddPoint("Data");

        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);
        _logger.LogInformation("{timer}", timer.ToString());

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("specific")]
    public async Task<IActionResult> Specific([FromBody] ApiAuctionsSpecificForm form)
    {
        if (string.IsNullOrEmpty(form.AppearanceSource) && form.ItemId <= 0 && form.PetSpeciesId <= 0)
        {
            return BadRequest();
        }

        var timer = new JankTimer();

        var data = await _auctionService.Specific(form.Region, form.AppearanceSource, form.ItemId, form.PetSpeciesId);

        timer.AddPoint("Data");

        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);
        _logger.LogInformation("{timer}", timer.ToString());

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpGet("commodities")]
    [Authorize]
    public async Task<IActionResult> Commodities()
    {
        var timer = new JankTimer();

        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            _logger.LogWarning("ruh roh");
            return NotFound();
        }

        timer.AddPoint("User");

        var data = await _auctionService.CommoditiesDataForUser(user, timer);

        timer.AddPoint("Data");

        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);
        _logger.LogInformation("{timer}", timer.ToString());

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("extra-pets")]
    [Authorize]
    public async Task<IActionResult> ExtraPets([FromBody] ApiExtraPetsForm form)
    {
        var timer = new JankTimer();

        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            _logger.LogWarning("ruh roh");
            return NotFound();
        }

        timer.AddPoint("User");

        var data = await _auctionService.ExtraPetDataForUser(user, timer);

        timer.AddPoint("Data");

        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);
        _logger.LogInformation("{timer}", timer.ToString());

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("missing")]
    [Authorize]
    public async Task<IActionResult> Missing([FromBody] ApiMissingAuctionsForm form)
    {
        var timer = new JankTimer();

        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            _logger.LogWarning("ruh roh");
            return NotFound();
        }

        var accountQuery = _context.PlayerAccount
            .AsNoTracking()
            .Where(pa => pa.UserId == user.Id && pa.Enabled);

        if (form.Type == "pets")
        {
            accountQuery = accountQuery.Include(pa => pa.Pets);
        }
        else if (form.Type == "toys")
        {
            accountQuery = accountQuery.Include(pa => pa.Toys);
        }

        var accounts = await accountQuery.ToArrayAsync();

        timer.AddPoint("Accounts");

        var auctionQuery = _context.WowAuction
            .AsNoTracking();

        if (!form.AllRealms)
        {
            int[] accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);
            auctionQuery = auctionQuery
                .Where(auction => accountConnectedRealmIds.Contains(auction.ConnectedRealmId));
        }

        int[] validRealmIds;
        if (form.Region > 0)
        {
            var connectedRealmQuery = _context.WowRealm
                .AsNoTracking()
                .Where(realm => realm.Region == form.Region);

            if (form.Region == WowRegion.EU && !form.IncludeRussia)
            {
                connectedRealmQuery = connectedRealmQuery.Where(realm => realm.Locale != "ruRU");
            }

            validRealmIds = await connectedRealmQuery
                .Select(realm => realm.ConnectedRealmId)
                .Distinct()
                .ToArrayAsync();
        }
        else
        {
            validRealmIds = await GetRegionRealmIds(user, accounts);
        }

        auctionQuery = auctionQuery
            .Where(auction => validRealmIds.Contains(auction.ConnectedRealmId));

        var languageQuery = _context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Language == user.Settings.General.Language);

        var data = new UserAuctionData();
        if (form.Type == "mounts")
        {
            // Missing
            var userCache = await _cacheService.CreateOrUpdateMountCacheAsync(_context, timer, user.Id);
            var mountIds = userCache.MountIds.Select(id => (int)id).ToArray();

            var missingMounts = await _context.WowMount
                .AsNoTracking()
                .Where(mount =>
                    mount.ItemId > 0 &&
                    !mountIds.Contains(mount.Id)
                )
                .ToArrayAsync();

            // Auctions
            var mountSpellMap = missingMounts.ToDictionary(mount => mount.ItemId, mount => mount.SpellId);

            var mountAuctions = await auctionQuery
                .Where(auction => missingMounts.Select(mount => mount.ItemId).Contains(auction.ItemId))
                .ToArrayAsync();

            data.RawAuctions = DoAuctionStuff(
                mountAuctions.GroupBy(auction => mountSpellMap.GetValueOrDefault(auction.ItemId)),
                form.IncludeBids
            );

            // Strings
            var mountIdToSpellId = missingMounts
                .ToDictionary(
                    mount => mount.Id,
                    mount => mount.SpellId
                );

            data.Names = await languageQuery
                .Where(ls =>
                    ls.Type == StringType.WowMountName &&
                    mountIdToSpellId.Keys.Contains(ls.Id)
                )
                .ToDictionaryAsync(
                    ls => mountIdToSpellId[ls.Id],
                    ls => ls.String
                );
        }
        else if (form.Type == "pets")
        {
            var allPets = accounts
                .Where(account => account.Pets != null)
                .SelectMany(account => account.Pets.Pets.EmptyIfNull().Values)
                .ToArray();

            var havePets = form.MissingPetsNeedMaxLevel ? allPets.Where(pet => pet.Level == 25) : allPets;

            int[] accountPetIds = havePets
                .Select(pet => pet.SpeciesId)
                .Distinct()
                .ToArray();

            var missingPets = await _context.WowPet
                .AsNoTracking()
                .Where(pet =>
                    (pet.Flags & 32) == 0 && // HideFromJournal
                    //pet.SourceType != 4 && // WildPet
                    !accountPetIds.Contains(pet.Id))
                .ToArrayAsync();

            var petItemMap = missingPets
                .Where(pet => pet.ItemId > 0)
                .ToDictionary(pet => pet.ItemId, pet => pet.CreatureId);
            var petSpeciesMap = missingPets
                .ToDictionary(pet => pet.Id, pet => pet.CreatureId);

            var missingPetItemIds = petItemMap
                .Keys
                .ToArray();
            var missingPetSpeciesIds = petSpeciesMap
                .Keys
                .Select(speciesId => (short)speciesId)
                .ToArray();

            // Auctions
            var petAuctionQuery = auctionQuery;

            if (form.MissingPetsMaxLevel)
            {
                petAuctionQuery = petAuctionQuery.Where(auction => auction.PetLevel == 25);
            }

            petAuctionQuery = petAuctionQuery
                .Where(auction => missingPetItemIds.Contains(auction.ItemId))
                .Union(petAuctionQuery
                    .Where(auction => missingPetSpeciesIds.Contains(auction.PetSpeciesId))
                );

            var petAuctions = await petAuctionQuery.ToArrayAsync();

            data.RawAuctions = DoAuctionStuff(
                petAuctions.GroupBy(auction => auction.PetSpeciesId > 0
                    ? petSpeciesMap.GetValueOrDefault(auction.PetSpeciesId)
                    : petItemMap.GetValueOrDefault(auction.ItemId)
                ),
                form.IncludeBids
            );

            // Strings
            var allCreatureIds = missingPets
                .Select(pet => pet.CreatureId)
                .Distinct();

            data.Names = await languageQuery
                .Where(ls =>
                    ls.Type == StringType.WowCreatureName &&
                    allCreatureIds.Contains(ls.Id)
                )
                .ToDictionaryAsync(
                    ls => ls.Id,
                    ls => ls.String
                );

        }
        else if (form.Type == "toys")
        {
            // Missing
            var accountToyIds = accounts
                .Where(account => account.Toys != null)
                .SelectMany(account => account.Toys.ToyIds.EmptyIfNull())
                .Distinct()
                .ToArray();

            var missingToys = await _context.WowToy
                .AsNoTracking()
                .Where(toy =>
                    toy.ItemId > 0 &&
                    !accountToyIds.Contains(toy.Id)
                )
                .ToArrayAsync();

            // Auctions
            var toyAuctions = await auctionQuery
                .Where(auction => missingToys.Select(toy => toy.ItemId).Contains(auction.ItemId))
                .ToArrayAsync();

            data.RawAuctions = DoAuctionStuff(
                toyAuctions.GroupBy(auction => auction.ItemId),
                form.IncludeBids
                );

            // Strings
            var allItemIds = data.RawAuctions.Keys
                .Distinct()
                .ToArray();

            data.Names = await languageQuery
                .Where(ls =>
                    ls.Type == StringType.WowItemName &&
                    allItemIds.Contains(ls.Id)
                )
                .ToDictionaryAsync(
                    ls => ls.Id,
                    ls => ls.String
                );
        }

        data.Updated = await _memoryCacheService.GetAuctionHouseUpdatedTimes();

        timer.AddPoint("Data", true);

        _logger.LogInformation($"{timer}");

        var json = JsonSerializer.Serialize(data, _jsonSerializerOptions);
        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("missing-appearance-ids")]
    [Authorize]
    public async Task<IActionResult> MissingAppearanceIds([FromBody] ApiMissingTransmogForm form)
    {
        var timer = new JankTimer();

        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            _logger.LogWarning("ruh roh");
            return NotFound();
        }

        bool hasCache = await _context.UserCache.AnyAsync(utc => utc.UserId == user.Id);
        if (!hasCache)
        {
            return NoContent();
        }

        // Always apply a region limit
        var region = (WowRegion)Math.Max(1, (int)form.Region);
        var connectedRealmQuery = _context.WowRealm
            .AsNoTracking()
            .Where(realm => realm.Region == region);

        if (region == WowRegion.EU && !form.IncludeRussia)
        {
            connectedRealmQuery = connectedRealmQuery.Where(realm => realm.Locale != "ruRU");
        }

        int[] connectedRealmIds = await connectedRealmQuery
            .Select(realm => realm.ConnectedRealmId)
            .Distinct()
            .ToArrayAsync();

        if (!form.AllRealms)
        {
            var accounts = await _context.PlayerAccount
                .AsNoTracking()
                .Where(pa => pa.UserId == user.Id && pa.Enabled)
                .Include(pa => pa.Pets)
                .ToArrayAsync();
            var accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);

            connectedRealmIds = connectedRealmIds
                .Intersect(accountConnectedRealmIds)
                .ToArray();
        }

        timer.AddPoint("Realms");

        var missingAppearanceIds = await _context.Database
            .SqlQuery<int>($@"
WITH transmog_cache (appearance_id) AS (
    SELECT  UNNEST(appearance_ids) AS appearance_id
    FROM    user_cache
    WHERE   user_id = {user.Id}
)
SELECT  DISTINCT wima.appearance_id
FROM    wow_item_modified_appearance wima
LEFT OUTER JOIN transmog_cache tc
    ON wima.appearance_id = tc.appearance_id
WHERE   tc.appearance_id IS NULL
").ToArrayAsync();

        timer.AddPoint("MissingAppearances");

        await using var connection = _context.GetConnection();
        await connection.OpenAsync();

        var auctions = new List<MissingTransmogByAppearanceIdQuery>();
        await using (var command = new NpgsqlCommand(MissingTransmogByAppearanceIdQuery.Sql, connection)
                     {
                         Parameters =
                         {
                             new() { Value = connectedRealmIds },
                             new() { Value = missingAppearanceIds },
                         }
                     })
        {
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                auctions.Add(new()
                {
                    ConnectedRealmId = reader.GetInt32(0),
                    AppearanceId = reader.GetInt32(1),
                    ItemId = reader.GetInt32(2),
                    TimeLeft = (WowAuctionTimeLeft)reader.GetInt16(3),
                    BuyoutPrice = reader.GetInt64(4),
                    BonusIds = (int[])reader.GetValue(5),
                });
            }
        }

        timer.AddPoint("Auctions");

        var grouped = auctions
            .GroupBy(auction => auction.AppearanceId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(auction => auction.BuyoutPrice)
                    .Take(5)
                    .ToList()
            );

        timer.AddPoint("Grouping");

        var data = new
        {
            Auctions = grouped,
            Updated = await _memoryCacheService.GetAuctionHouseUpdatedTimes(),
        };
        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);

        int kept = grouped.Values
            .Select(groupAuctions => groupAuctions.Count)
            .Sum();
        _logger.LogInformation($"{auctions.Count} rows, kept {kept}");
        _logger.LogInformation($"{timer}");

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("missing-appearance-sources")]
    [Authorize]
    public async Task<IActionResult> MissingAppearanceSources([FromBody] ApiMissingTransmogForm form)
    {
        var timer = new JankTimer();

        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            _logger.LogWarning("ruh roh");
            return NotFound();
        }

        bool hasCache = await _context.UserCache.AnyAsync(utc => utc.UserId == user.Id);
        if (!hasCache)
        {
            return NoContent();
        }

        // Always apply a region limit
        var region = (WowRegion)Math.Max(1, (int)form.Region);
        var connectedRealmQuery = _context.WowRealm
            .AsNoTracking()
            .Where(realm => realm.Region == region);

        if (region == WowRegion.EU && !form.IncludeRussia)
        {
            connectedRealmQuery = connectedRealmQuery.Where(realm => realm.Locale != "ruRU");
        }

        int[] connectedRealmIds = await connectedRealmQuery
            .Select(realm => realm.ConnectedRealmId)
            .Distinct()
            .ToArrayAsync();

        if (!form.AllRealms)
        {
            var accounts = await _context.PlayerAccount
                .AsNoTracking()
                .Where(pa => pa.UserId == user.Id && pa.Enabled)
                .Include(pa => pa.Pets)
                .ToArrayAsync();
            int[] accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);

            connectedRealmIds = connectedRealmIds
                .Intersect(accountConnectedRealmIds)
                .ToArray();
        }

        timer.AddPoint("Realms");

        var missingAppearanceSources = await _context.Database
            .SqlQuery<string>($@"
WITH transmog_cache (appearance_source) AS (
    SELECT  UNNEST(appearance_sources) AS appearance_source
    FROM    user_cache
    WHERE   user_id = {user.Id}
)
SELECT  sigh.oof
FROM (
    SELECT  DISTINCT wima.item_id || '_' || wima.modifier AS oof
    FROM    wow_item_modified_appearance wima
) sigh
LEFT OUTER JOIN transmog_cache tc
    ON sigh.oof = tc.appearance_source
WHERE   tc.appearance_source IS NULL
").ToArrayAsync();

        timer.AddPoint("MissingAppearances");

        await using var connection = _context.GetConnection();
        await connection.OpenAsync();

        var auctions = new List<MissingTransmogByAppearanceSourceQuery>();
        await using (var command = new NpgsqlCommand(MissingTransmogByAppearanceSourceQuery.Sql, connection)
                     {
                         Parameters =
                         {
                             new() { Value = connectedRealmIds },
                             new() { Value = missingAppearanceSources },
                         }
                     })
        {
            await using var reader = await command.ExecuteReaderAsync();

            timer.AddPoint("Query");

            while (await reader.ReadAsync())
            {
                auctions.Add(new()
                {
                    ConnectedRealmId = reader.GetInt32(0),
                    AppearanceSource = reader.GetString(1),
                    ItemId = reader.GetInt32(2),
                    TimeLeft = (WowAuctionTimeLeft)reader.GetInt16(3),
                    BuyoutPrice = reader.GetInt64(4),
                    BonusIds = (int[])reader.GetValue(5),
                });
            }
        }

        timer.AddPoint("Load");

        var grouped = auctions
            .GroupBy(auction => auction.AppearanceSource)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(auction => auction.BuyoutPrice)
                    .Take(5)
                    .ToList()
            );

        timer.AddPoint("Group");

        var data = new
        {
            Auctions = grouped,
            Updated = await _memoryCacheService.GetAuctionHouseUpdatedTimes(),
        };
        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);

        int kept = grouped.Values
            .Select(groupAuctions => groupAuctions.Count)
            .Sum();
        _logger.LogInformation($"{auctions.Count} rows, kept {kept}");
        _logger.LogInformation($"{timer}");

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("missing-recipes")]
    [Authorize]
    public async Task<IActionResult> MissingProfessionRecipes([FromBody] ApiMissingProfessionRecipesForm form)
    {
        var timer = new JankTimer();

        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            _logger.LogWarning("ruh roh");
            return NotFound();
        }

        timer.AddPoint("User");

        int[] connectedRealmIds;
        var skillLineIds = new HashSet<int>();
        var skillLineAbilityIds = new HashSet<int>();
        if (form.CharacterId > 0)
        {
            var character = await _context.PlayerCharacter
                .Include(pc => pc.Professions)
                .Where(pc => pc.Account.UserId == user.Id && pc.Id == form.CharacterId)
                .FirstOrDefaultAsync();
            if (character == null)
            {
                return NotFound();
            }

            // Profession info
            foreach (var (rootId, subProfessions) in character.Professions.Professions)
            {
                if (form.ProfessionId > 0 && form.ProfessionId != rootId)
                {
                    continue;
                }

                skillLineIds.Add(rootId);
                foreach (var (subProfessionId, subProfession) in subProfessions)
                {
                    skillLineIds.Add(subProfessionId);
                    skillLineAbilityIds.UnionWith(subProfession.KnownRecipes);
                }
            }

            timer.AddPoint("CharacterProfessions");

            var characterRealm = await _context.WowRealm
                .FirstAsync(wr => wr.Id == character.RealmId);

            connectedRealmIds = await _context.WowRealm
                .AsNoTracking()
                .Where(realm => realm.Region == characterRealm.Region)
                .Select(realm => realm.ConnectedRealmId)
                .Distinct()
                .ToArrayAsync();
        }
        else
        {
            skillLineIds.Add(form.ProfessionId);

            var region = (WowRegion)Math.Max(1, (int)form.Region);
            int[] realmIds = await _context.WowRealm
                .Where(wr => wr.Region == region)
                .Select(wr => wr.Id)
                .ToArrayAsync();

            var characterProfessions = await _context.PlayerCharacterProfessions
                .AsNoTracking()
                .Where(pcp => pcp.Character.Account.UserId == user.Id
                    && realmIds.Contains(pcp.Character.RealmId))
                .ToArrayAsync();
            foreach (var characterProfession in characterProfessions)
            {
                foreach (var (rootId, subProfessions) in characterProfession.Professions)
                {
                    if (form.ProfessionId > 0 && form.ProfessionId != rootId)
                    {
                        continue;
                    }

                    skillLineIds.Add(rootId);

                    foreach (var (subProfessionId, subProfession) in subProfessions)
                    {
                        skillLineIds.Add(subProfessionId);
                        skillLineAbilityIds.UnionWith(subProfession.KnownRecipes);
                    }
                }
            }

            timer.AddPoint("CharacterProfessions");

            // Always apply a region limit
            connectedRealmIds = await _context.WowRealm
                .AsNoTracking()
                .Where(realm => realm.Region == region)
                .Select(realm => realm.ConnectedRealmId)
                .Distinct()
                .ToArrayAsync();
        }

        if (!form.AllRealms)
        {
            var accounts = await _context.PlayerAccount
                .AsNoTracking()
                .Where(pa => pa.UserId == user.Id && pa.Enabled)
                .ToArrayAsync();
            int[] accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);

            connectedRealmIds = connectedRealmIds
                .Intersect(accountConnectedRealmIds)
                .ToArray();
        }

        timer.AddPoint("Realms");

        _logger.LogInformation("skillLineIds: {0}", string.Join(",", skillLineIds));
        _logger.LogInformation("skillLineAbilityIds: {0}", string.Join(",", skillLineAbilityIds));

        // Missing recipes
        var recipeItems = await _memoryCacheService.GetProfessionRecipeItems();
        var missingRecipeItemIds = new HashSet<int>();
        foreach (int skillLineId in skillLineIds)
        {
            if (recipeItems.TryGetValue(skillLineId, out var abilities))
            {
                foreach (var kvp in abilities.Where(kvp => !skillLineAbilityIds.Contains(kvp.Key)))
                {
                    missingRecipeItemIds.UnionWith(kvp.Value);
                }
            }
        }

        timer.AddPoint("MissingRecipes");

        // Auctions
        await using var connection = _context.GetConnection();
        await connection.OpenAsync();

        // _logger.LogInformation("connectedRealmIds: {0}", string.Join(",", connectedRealmIds));
        // _logger.LogInformation("missingRecipeItemIds: {0}", string.Join(",", missingRecipeItemIds));

        var auctions = new List<MissingRecipeQuery>();
        await using (var command = new NpgsqlCommand(MissingRecipeQuery.Sql, connection)
                     {
                         Parameters =
                         {
                             new() { Value = connectedRealmIds },
                             new() { Value = missingRecipeItemIds.ToArray() },
                         },
                     })
        {
            await using var reader = await command.ExecuteReaderAsync();
            timer.AddPoint("Query");

            while (await reader.ReadAsync())
            {
                auctions.Add(new()
                {
                    ConnectedRealmId = reader.GetInt32(0),
                    ItemId = reader.GetInt32(1),
                    TimeLeft = (WowAuctionTimeLeft)reader.GetInt16(2),
                    BuyoutPrice = reader.GetInt64(3)
                });
            }
        }

        timer.AddPoint("Load");

        var grouped = auctions
            .GroupBy(auction => auction.ItemId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(auction => auction.BuyoutPrice)
                    .Take(5)
                    .ToList()
            );

        timer.AddPoint("Group");

        var data = new
        {
            Auctions = grouped,
            Updated = await _memoryCacheService.GetAuctionHouseUpdatedTimes(),
        };
        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);

        int kept = grouped.Values
            .Select(groupAuctions => groupAuctions.Count)
            .Sum();
        _logger.LogInformation($"{auctions.Count} rows, kept {kept}");
        _logger.LogInformation($"{timer}");

        return Content(json, MediaTypeNames.Application.Json);
    }

    [HttpPost("specific-item")]
    [Authorize]
    public async Task<IActionResult> SpecificItem([FromBody] ApiAuctionSpecificItemForm form)
    {
        var timer = new JankTimer();

        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user == null)
        {
            _logger.LogWarning("ruh roh");
            return NotFound();
        }

        var accounts = await _context.PlayerAccount
            .AsNoTracking()
            .Where(pa => pa.UserId == user.Id && pa.Enabled)
            .ToArrayAsync();

        timer.AddPoint("Accounts");

        var auctionQuery = _context.WowAuction
            .AsNoTracking();

        if (!form.AllRealms)
        {
            int[] accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);
            auctionQuery = auctionQuery
                .Where(auction => accountConnectedRealmIds.Contains(auction.ConnectedRealmId));
        }

        int[] validRealmIds;
        if (form.Region > 0)
        {
            var connectedRealmQuery = _context.WowRealm
                .AsNoTracking()
                .Where(realm => realm.Region == form.Region);

            if (form.Region == WowRegion.EU && !form.IncludeRussia)
            {
                connectedRealmQuery = connectedRealmQuery.Where(realm => realm.Locale != "ruRU");
            }

            validRealmIds = await connectedRealmQuery
                .Select(realm => realm.ConnectedRealmId)
                .Distinct()
                .ToArrayAsync();
        }
        else
        {
            validRealmIds = await GetRegionRealmIds(user, accounts);
        }

        auctionQuery = auctionQuery
            .Where(auction => validRealmIds.Contains(auction.ConnectedRealmId));

        var languageQuery = _context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Language == user.Settings.General.Language);

        var data = new UserAuctionData();

        var auctions = await auctionQuery
            .Where(auction => auction.ItemId == form.ItemId)
            .ToArrayAsync();

        data.RawAuctions = DoAuctionStuff(auctions.GroupBy(auction => auction.ItemId));

        timer.AddPoint("Data", true);

        _logger.LogInformation("{timer}", timer.ToString());

        string json = JsonSerializer.Serialize(data, _jsonSerializerOptions);
        return Content(json, MediaTypeNames.Application.Json);
    }

    private static Dictionary<int, List<WowAuction>> DoAuctionStuff(
        IEnumerable<IGrouping<int, WowAuction>> groupedAuctions,
        bool includeLowBid = true
    )
    {
        var groupedThings = groupedAuctions
            .Where(group => group.Key > 0)
            .ToDictionary(
                group => group.Key,
                group => group
                    .ToGroupedDictionary(auction => auction.ConnectedRealmId)
            );

        var ret = new Dictionary<int, List<WowAuction>>();
        foreach (var (thingId, itemRealms) in groupedThings)
        {
            ret[thingId] = new List<WowAuction>();
            foreach (var (_, realmAuctions) in itemRealms)
            {
                var lowestBuyout = realmAuctions
                    .Where(auction => auction.BuyoutPrice > 0)
                    .MinBy(auction => auction.BuyoutPrice);

                if (includeLowBid)
                {
                    var lowestBid = realmAuctions
                        .Where(auction => auction.BidPrice > 0)
                        .MinBy(auction => auction.BidPrice);

                    if (lowestBid != null && lowestBuyout != null)
                    {
                        ret[thingId].Add(lowestBuyout.BuyoutPrice <= lowestBid.BidPrice ? lowestBuyout : lowestBid);
                    }
                    else if (lowestBid != null)
                    {
                        ret[thingId].Add(lowestBid);
                    }
                    else if (lowestBuyout != null)
                    {
                        ret[thingId].Add(lowestBuyout);
                    }
                }
                else if (lowestBuyout != null)
                {
                    ret[thingId].Add(lowestBuyout);
                }
            }

            if (includeLowBid)
            {
                ret[thingId].Sort((a, b) => a.UsefulPrice.CompareTo(b.UsefulPrice));
            }
            else
            {
                ret[thingId].Sort((a, b) => a.BuyoutPrice.CompareTo(b.BuyoutPrice));
            }
        }

        return ret;
    }

    private async Task<int[]> GetConnectedRealmIds(ApplicationUser user, PlayerAccount[] accounts)
    {
        var accountIds = accounts.SelectArray(account => account.Id);
        var ignoredRealms = user.Settings.Auctions?.IgnoredRealms.EmptyIfNull();

        var accountConnectedRealmIds = await _context.WowRealm
            .AsNoTracking()
            .Where(realm =>
                _context.PlayerCharacter
                    .Where(pc => pc.AccountId != null && accountIds.Contains(pc.AccountId.Value))
                    .Select(pc => pc.RealmId)
                    .Contains(realm.Id) &&
                !ignoredRealms.Contains(realm.ConnectedRealmId)
            )
            .Select(realm => realm.ConnectedRealmId)
            .Distinct()
            .ToArrayAsync();

        return accountConnectedRealmIds;
    }

    private async Task<int[]> GetRegionRealmIds(ApplicationUser user, PlayerAccount[] accounts)
    {
        var accountIds = accounts.SelectArray(account => account.Id);
        var ignoredRealms = user.Settings.Auctions?.IgnoredRealms.EmptyIfNull();

        var regions = await _context.WowRealm
            .AsNoTracking()
            .Where(realm =>
                _context.PlayerCharacter
                    .Where(pc => pc.AccountId != null && accountIds.Contains(pc.AccountId.Value))
                    .Select(pc => pc.RealmId)
                    .Contains(realm.Id)
            )
            .Select(realm => realm.Region)
            .Distinct()
            .ToArrayAsync();

        var regionRealmIds = await _context.WowRealm
            .AsNoTracking()
            .Where(realm => regions.Contains(realm.Region))
            .Select(realm => realm.ConnectedRealmId)
            .ToArrayAsync();

        return regionRealmIds;
    }
}
