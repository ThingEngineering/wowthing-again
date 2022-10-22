using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Forms;
using Wowthing.Web.Models;

namespace Wowthing.Web.Controllers;

[Route("api/auctions")]
public class ApiAuctionController : Controller
{
    private readonly ILogger<ApiAuctionController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WowDbContext _context;

    public ApiAuctionController(ILogger<ApiAuctionController> logger, UserManager<ApplicationUser> userManager, WowDbContext context)
    {
        _logger = logger;
        _userManager = userManager;
        _context = context;
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

        var data = new UserAuctionData();
        var allPets = new Dictionary<long, PlayerAccountPetsPet>();

        var accounts = await _context.PlayerAccount
            .AsNoTracking()
            .Where(pa => pa.UserId == user.Id)
            .Include(pa => pa.Pets)
            .ToArrayAsync();

        var accountIds = accounts.SelectArray(account => account.Id);

        var accountPets = accounts
            .Where(pa => pa.Pets != null)
            .Select(pa => pa.Pets)
            .OrderByDescending(pap => pap.UpdatedAt)
            .ToArray();

        foreach (var pets in accountPets)
        {
            foreach (var (petId, pet) in pets.Pets)
            {
                allPets.TryAdd(petId, pet);
            }
        }

        // Pet itemId -> id map
        var petItemIdMap = await GetPetItems();
        var petItemIds = petItemIdMap.Keys.ToArray();

        // Caged pets
        var guildCages = await _context
            .PlayerGuildItem
            .Where(pgi =>
                pgi.Guild.UserId == user.Id &&
                pgi.ItemId == 82800 && // Pet Cage
                pgi.Context > 0
            )
            .ToArrayAsync();

        var playerCages = await _context
            .PlayerCharacterItem
            .Where(pci =>
                    pci.Character.AccountId.HasValue &&
                    accountIds.Contains(pci.Character.AccountId.Value) &&
                    pci.ItemId == 82800 // Pet Cage
            )
            .ToArrayAsync();

        // Learnable pets
        var guildLearnable = await _context
            .PlayerGuildItem
            .Where(pgi =>
                pgi.Guild.UserId == user.Id &&
                petItemIds.Contains(pgi.ItemId)
            )
            .ToArrayAsync();

        var playerLearnable = await _context
            .PlayerCharacterItem
            .Where(pci =>
                pci.Character.AccountId.HasValue &&
                accountIds.Contains(pci.Character.AccountId.Value) &&
                petItemIds.Contains(pci.ItemId)
            )
            .ToArrayAsync();

        var accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);

        timer.AddPoint("Accounts");

        var groupedPets = allPets.Values
            .GroupBy(pet => pet.SpeciesId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(pet => new UserAuctionDataPet(pet))
                    .ToList()
            );

        foreach (var cagedPet in guildCages)
        {
            int speciesId = cagedPet.Context;
            if (!groupedPets.TryGetValue(speciesId, out var pets))
            {
                pets = groupedPets[speciesId] = new List<UserAuctionDataPet>();
            }

            pets.Add(new UserAuctionDataPet(cagedPet, true));
        }

        foreach (var cagedPet in playerCages)
        {
            int speciesId = cagedPet.Context;
            if (!groupedPets.TryGetValue(speciesId, out var pets))
            {
                pets = groupedPets[speciesId] = new List<UserAuctionDataPet>();
            }

            pets.Add(new UserAuctionDataPet(cagedPet, true));
        }

        foreach (var learnablePet in guildLearnable)
        {
            int speciesId = petItemIdMap[learnablePet.ItemId];
            if (!groupedPets.TryGetValue(speciesId, out var pets))
            {
                pets = groupedPets[speciesId] = new List<UserAuctionDataPet>();
            }

            pets.Add(new UserAuctionDataPet(learnablePet));
        }

        foreach (var learnablePet in playerLearnable)
        {
            int speciesId = petItemIdMap[learnablePet.ItemId];
            if (!groupedPets.TryGetValue(speciesId, out var pets))
            {
                pets = groupedPets[speciesId] = new List<UserAuctionDataPet>();
            }

            pets.Add(new UserAuctionDataPet(learnablePet));
        }

        var extraPets = groupedPets
            .Where(kvp => form.IgnoreJournal
                ? (
                    kvp.Value.Any(pet => pet.Location == ItemLocation.PetCollection) &&
                    kvp.Value.Any(pet => pet.Location != ItemLocation.PetCollection)
                )
                : kvp.Value.Count > 1
            )
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value
                    .OrderBy(pet => pet.Quality)
                    .ThenBy(pet => pet.Level)
                    .ToArray()
            );

        var extraSpeciesIds = extraPets.Keys.ToArray();

        var petSpeciesMap = await _context.WowPet
            .Where(pet => extraSpeciesIds.Contains(pet.Id))
            .ToDictionaryAsync(
                pet => pet.Id,
                pet => pet.CreatureId
            );

        long minimumValue = (user.Settings.Auctions?.MinimumExtraPetsValue ?? 0) * 10000;
        var auctions = await _context.WowAuction
            .AsNoTracking()
            .Where(auction =>
                accountConnectedRealmIds.Contains(auction.ConnectedRealmId) &&
                extraSpeciesIds.Contains(auction.PetSpeciesId) &&
                auction.BuyoutPrice >= minimumValue
            )
            .ToArrayAsync();

        data.Auctions = DoAuctionStuff(auctions.GroupBy(auction => petSpeciesMap[auction.PetSpeciesId]), false);

        timer.AddPoint("Auctions");

        var creatureIds = extraSpeciesIds.Select(speciesId => petSpeciesMap[speciesId]);
        data.Names = await _context.LanguageString
            .AsNoTracking()
            .Where(ls =>
                ls.Language == user.Settings.General.Language &&
                ls.Type == StringType.WowCreatureName &&
                creatureIds.Contains(ls.Id)
            )
            .ToDictionaryAsync(
                ls => ls.Id,
                ls => ls.String
            );

        timer.AddPoint("Strings");

        data.Pets = extraPets
            .ToDictionary(
                kvp => petSpeciesMap[kvp.Key],
                kvp => kvp.Value
            );

        timer.AddPoint("Data", true);

        _logger.LogInformation($"{timer}");

        return Ok(data);
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
            .Where(pa => pa.UserId == user.Id);

        if (form.Type == "pets")
        {
            accountQuery = accountQuery.Include(pa => pa.Pets);
        }
        else if (form.Type == "toys")
        {
            accountQuery = accountQuery.Include(pa => pa.Toys);
        }

        var accounts = await accountQuery.ToArrayAsync();

        var accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);

        timer.AddPoint("Accounts");
        Console.WriteLine("allrealms {0}", form.AllRealms);

        var auctionQuery = _context.WowAuction
            .AsNoTracking();

        if (!form.AllRealms)
        {
            auctionQuery = auctionQuery
                .Where(auction => accountConnectedRealmIds.Contains(auction.ConnectedRealmId));
        }

        if (form.Region > 0)
        {
            var validRealmIds = await _context.WowRealm
                .AsNoTracking()
                .Where(realm => realm.Region == form.Region)
                .Select(realm => realm.ConnectedRealmId)
                .Distinct()
                .ToArrayAsync();

            auctionQuery = auctionQuery
                .Where(auction => validRealmIds.Contains(auction.ConnectedRealmId));
        }
        else
        {
            var validRealmIds = await GetRegionRealmIds(user, accounts);
            auctionQuery = auctionQuery
                .Where(auction => validRealmIds.Contains(auction.ConnectedRealmId));
        }

        var languageQuery = _context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Language == user.Settings.General.Language);

        var data = new UserAuctionData();
        if (form.Type == "mounts")
        {
            // Missing
            var accountMounts = await _context.MountQuery
                .FromSqlRaw(MountQuery.UserQuery, user.Id)
                .SingleAsync();

            var allMountIds = accountMounts.Mounts
                .EmptyIfNull()
                .Union(accountMounts.AddonMounts.EmptyIfNull())
                .Distinct()
                .ToArray();

            var missingMounts = await _context.WowMount
                .AsNoTracking()
                .Where(mount =>
                    mount.ItemId > 0 &&
                    !allMountIds.Contains(mount.Id)
                )
                .ToArrayAsync();

            // Auctions
            var mountSpellMap = missingMounts.ToDictionary(mount => mount.ItemId, mount => mount.SpellId);

            var mountAuctions = await auctionQuery
                .Where(auction => missingMounts.Select(mount => mount.ItemId).Contains(auction.ItemId))
                .ToArrayAsync();

            data.Auctions = DoAuctionStuff(mountAuctions.GroupBy(auction => mountSpellMap[auction.ItemId]));

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
            // Missing
            var accountPetIds = accounts
                .Where(account => account.Pets != null)
                .SelectMany(account => account.Pets.Pets
                    .EmptyIfNull()
                    .Select(pet => pet.Value.SpeciesId)
                )
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

            data.Auctions = DoAuctionStuff(
                petAuctions.GroupBy(auction => auction.PetSpeciesId > 0
                    ? petSpeciesMap[auction.PetSpeciesId]
                    : petItemMap[auction.ItemId]
            ));

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
                    !accountToyIds.Contains(toy.ItemId)
                )
                .ToArrayAsync();

            // Auctions
            var toyAuctions = await auctionQuery
                .Where(auction => missingToys.Select(toy => toy.ItemId).Contains(auction.ItemId))
                .ToArrayAsync();

            data.Auctions = DoAuctionStuff(toyAuctions.GroupBy(auction => auction.ItemId));

            // Strings
            var allItemIds = data.Auctions.Keys
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

        timer.AddPoint("Data", true);

        _logger.LogInformation($"{timer}");

        return Ok(data);
    }

    private static Dictionary<int, List<WowAuction>> DoAuctionStuff(IEnumerable<IGrouping<int, WowAuction>> groupedAuctions, bool includeLowBid = true)
    {
        var groupedThings = groupedAuctions
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
                var lowestBid = realmAuctions
                    .Where(auction => auction.BidPrice > 0)
                    .OrderBy(auction => auction.BidPrice)
                    .FirstOrDefault();
                var lowestBuyout = realmAuctions
                    .Where(auction => auction.BuyoutPrice > 0)
                    .OrderBy(auction => auction.BuyoutPrice)
                    .FirstOrDefault();

                if (lowestBid == null)
                {
                    ret[thingId].Add(lowestBuyout);
                }
                else if (lowestBuyout == null)
                {
                    ret[thingId].Add(lowestBid);
                }
                else if (lowestBid.AuctionId == lowestBuyout.AuctionId)
                {
                    ret[thingId].Add(lowestBid);
                }
                else
                {
                    if (includeLowBid && lowestBid.BidPrice < lowestBuyout.BuyoutPrice)
                    {
                        ret[thingId].Add(lowestBid);
                    }
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

    private async Task<Dictionary<int, int>> GetPetItems()
    {
        return await _context.WowPet
            .Where(pet => (pet.Flags & 32) == 0 && pet.ItemId > 0)
            .ToDictionaryAsync(pet => pet.ItemId, pet => pet.Id);
    }
}
