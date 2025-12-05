using System.Globalization;
using System.Text.RegularExpressions;
using Wowthing.Backend.Models.Uploads;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Global;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;
using Polly;
using Polly.Retry;
using Wowthing.Backend.Helpers;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.User;
using PredicateBuilder = Wowthing.Lib.Utilities.PredicateBuilder;

namespace Wowthing.Backend.Jobs.User;

public class UserUploadJob : JobBase
{
    private bool _resetAchievementCache;
    private bool _resetMountCache;
    private bool _resetQuestCache;
    private bool _resetTransmogCache;
    private long _userId;
    private JankTimer _timer;
    private Dictionary<(WowRegion Region, int Expansion), GlobalDailies> _globalDailiesMap;
    private Dictionary<int, WowRealm> _realmById;
    private Dictionary<(WowRegion Region, string Name), WowRealm> _realmByRegionAndName;
    private Dictionary<string, int> _instanceNameToIdMap;

    private static readonly Regex PlayerGuidRegex = new(@"^Player-\d+-([0-9A-Fa-f]+)$", RegexOptions.Compiled);
    private static readonly Regex ValidGuildRegex = new(@"^\d+/", RegexOptions.Compiled);

    private static readonly AsyncRetryPolicy<bool> LockRetryPolicy = Policy
        .HandleResult<bool>(r => r == false)
        .WaitAndRetryAsync(
            retryCount: 20,
            _ => TimeSpan.FromMilliseconds(250)
        );

    public override void Setup(string[] data)
    {
        _userId = long.Parse(data[0]);
        UserLog(_userId);
    }

    public override async Task Run(string[] data)
    {
        _timer = new JankTimer();

        Logger.Information("Processing {key}...", data[1]);

        // Lock on the user ID to prevent processing multiple uploads at the same time
        string lockKey = $"user_upload:{_userId}";
        string lockValue = Guid.NewGuid().ToString("N");
        try
        {
            var lockResult = await LockRetryPolicy.ExecuteAndCaptureAsync(
                () => JobRepository.AcquireLockAsync(lockKey, lockValue, TimeSpan.FromMinutes(1))
            );
            if (lockResult.Outcome == OutcomeType.Failure)
            {
                Logger.Error("Failed to acquire lock!");
                return;
            }
        }
        catch (Exception ex)
        {
            Logger.Error(ex, "Kaboom!");
            return;
        }

        _timer.AddPoint("Lock");

        var db = Redis.GetDatabase();
        string luaData = await db.CompressedStringGetAsync(data[1]);

        _timer.AddPoint("Redis");

        try
        {
            if (string.IsNullOrWhiteSpace(luaData))
            {
                Logger.Error("Lua data is empty!");
                return;
            }

            await Process(luaData);
            await db.KeyDeleteAsync(data[1]);
        }
        finally
        {
            await JobRepository.ReleaseLockAsync(lockKey, lockValue);
        }

        Logger.Information("{Timer}", _timer.ToString());
    }

    private async Task Process(string luaData) {
        _instanceNameToIdMap = (await MemoryCacheService.GetJournalInstanceMap())
            .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

        _realmByRegionAndName = await MemoryCacheService.GetRealmMap();

        _realmById = _realmByRegionAndName.Values
            .DistinctBy(realm => realm.Id)
            .ToDictionary(realm => realm.Id);

        long trustedRoleId = await MemoryCacheService.GetTrustedRole();
        bool hasTrustedRole = await Context.UserRoles
            .Where(ur => ur.UserId == _userId && ur.RoleId == trustedRoleId)
            .AnyAsync();
        if (hasTrustedRole)
        {
            _globalDailiesMap = await Context.GlobalDailies
                .ToDictionaryAsync(gd => (gd.Region, gd.Expansion));

            foreach (var region in EnumUtilities.GetValues<WowRegion>())
            {
                for (int expansion = 6; expansion <= 8; expansion++)
                {
                    if (!_globalDailiesMap.TryGetValue((region, expansion), out var globalDailies))
                    {
                        globalDailies = _globalDailiesMap[(region, expansion)] = new GlobalDailies
                        {
                            Expansion = expansion,
                            Region = region,
                        };
                        Context.GlobalDailies.Add(globalDailies);
                    }

                    if (globalDailies.QuestRewards == null)
                    {
                        globalDailies.QuestRewards = new();
                    }
                }
            }
        }

        _timer.AddPoint("Load");

        string json = LuaToJsonConverter4.Convert(luaData.Replace("WWTCSaved = ", ""))[1..^1];

        _timer.AddPoint("Convert");

#if DEBUG
        await File.WriteAllTextAsync(Path.Join("..", "..", "lua.json"), json);
        _timer.AddPoint("Write");
#endif

        Upload parsed;
        try
        {
            parsed = JsonSerializer.Deserialize<Upload>(json, JsonSerializerOptions);
        }
        catch (JsonException ex)
        {
            Logger.Error(ex, "Failed to deserialize upload!");
            return;
        }

        _timer.AddPoint("Parse");

        WowRegion? accountRegion = null;

        // Create UserAddonData if it doesn't exist
        var userAddonData = await Context.UserAddonData.FindAsync(_userId);
        if (userAddonData == null)
        {
            userAddonData = new UserAddonData(_userId);
            Context.UserAddonData.Add(userAddonData);
        }

        // Deal with guild data
        var guildMap = new Dictionary<(int RealmId, string Name), PlayerGuild>();
        foreach ((string addonId, var guildData) in parsed.Guilds.EmptyIfNull())
        {
            if (!ValidGuildRegex.IsMatch(addonId))
            {
                Logger.Warning("Invalid old-style guild id: {id}", addonId);
                continue;
            }

            (var realm, string guildName) = ParseAddonId(addonId);
            if (realm == null)
            {
                Logger.Warning("Invalid guild id: {id}", addonId);
                continue;
            }

            accountRegion ??= realm.Region;

            await using var guildContext = await NewContext();

            var guild = await guildContext.PlayerGuild
                .Include(pg => pg.Items)
                .Where(pg => pg.UserId == _userId && pg.RealmId == realm.Id && pg.Name == guildName)
                .FirstOrDefaultAsync();
            if (guild == null)
            {
                guild = new PlayerGuild
                {
                    UserId = _userId,
                    RealmId = realm.Id,
                    Name = guildName,
                };
                guildContext.PlayerGuild.Add(guild);
                await guildContext.SaveChangesAsync();
            }

            guildMap[(guild.RealmId, guild.Name)] = guild;

            try
            {
                await HandleGuildItems(guildContext, guild, guildData);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "HandleGuildItems failed for {realmId}/{name}!", guild.RealmId, guild.Name);
            }
        }

        _timer.AddPoint("Guilds");

        // Build a fancy set of character ORs
        var addonIdToCharacterId = new Dictionary<string, long>();
        var seenCharacterIds = new HashSet<long>();
        var characterPredicate = PredicateBuilder.False<PlayerCharacter>();
        foreach (var (addonId, characterData) in parsed.Characters.EmptyIfNull())
        {
            if (characterData.ScanTimes == null)
            {
                Logger.Warning($"ScanTimes is null: {addonId}");
                continue;
            }

            var lastSeen = characterData.LastSeen.AsUtcDateTime();

            // Player-[realm id]-[hex character id]
            var match = PlayerGuidRegex.Match(addonId);
            if (match.Success)
            {
                long characterId = Convert.ToInt64(match.Groups[1].Value, 16);
                addonIdToCharacterId.Add(addonId, characterId);

                if (!seenCharacterIds.Contains(characterId))
                {
                    seenCharacterIds.Add(characterId);
                    characterPredicate = characterPredicate.WowthingOr(pc =>
                        pc.CharacterId == characterId &&
                        pc.LastSeenAddon < lastSeen
                    );
                }
            }
            else {
                Logger.Warning($"Invalid character id: {addonId}");
            }
        }

        // Fetch character data
        var validCharacterIdToId = await Context.PlayerCharacter
            .Where(c => c.Account.UserId == _userId)
            .Where(characterPredicate)
            .Select(c => new { c.Id, c.CharacterId })
            .ToDictionaryAsync(c => c.CharacterId, c => c.Id);

        _timer.AddPoint("Valid");

        // Deal with character data
        var worldQuestReportMap = new Dictionary<WorldQuestReportKey, WorldQuestReport>();

        int accountId = 0;
        int updatedCharacters = 0;
        foreach (var (addonId, characterData) in parsed.Characters.EmptyIfNull())
        {
            if (!addonIdToCharacterId.TryGetValue(addonId, out long characterId) ||
                !validCharacterIdToId.TryGetValue(characterId, out int id))
            {
                continue;
            }

            await using var characterContext = await NewContext();

            var character = await characterContext.PlayerCharacter
                .Include(c => c.AddonAchievements)
                .Include(c => c.AddonData)
                .Include(c => c.AddonMounts)
                .Include(c => c.AddonQuests)
                //.Include(c => c.Currencies)
                .Include(c => c.Items)
                .Include(c => c.Lockouts)
                //.Include(c => c.MythicPlusAddon)
                .Include(c => c.Reputations)
                .Include(c => c.Shadowlands)
                .Include(c => c.Transmog)
                .Include(c => c.Weekly)
                .SingleAsync(c => c.Id == id);

            if (!_realmById.TryGetValue(character.RealmId, out var realm))
            {
                Logger.Warning($"Invalid realm id: {character.RealmId}");
                continue;
            }

            accountRegion ??= realm.Region;

            //Logger.Debug("Found character: {0} => {1}", addonId, character.Id);
            accountId = character.AccountId!.Value;

            int? guildId = null;
            if (!string.IsNullOrWhiteSpace(characterData.GuildName))
            {
                var (guildRealm, guildName) = ParseAddonId(characterData.GuildName);
                if (guildRealm != null && guildMap.TryGetValue((guildRealm.Id, guildName), out var guild))
                {
                    guildId = guild.Id;
                }
            }

            var processor = new UserUploadCharacterProcessor(Logger, characterContext, _instanceNameToIdMap, character, characterData, realm.Region);
            var result = await processor.Process(guildId);

            Logger.Information("Saving character {id} {region}/{realm}/{name}", character.Id, realm.Region, realm.Name, character.Name);
            try
            {
                int savedChanges = await characterContext.SaveChangesAsync();
                if (savedChanges > 0)
                {
                    updatedCharacters++;
                }

                _resetAchievementCache = _resetAchievementCache || result.ResetAchievementCache;
                _resetMountCache = _resetMountCache || result.ResetMountCache;
                _resetQuestCache = _resetQuestCache || result.ResetQuestCache;
                _resetTransmogCache = _resetTransmogCache || result.ResetTransmogCache;

                foreach (var (key, value) in result.WorldQuestReports)
                {
                    worldQuestReportMap.TryAdd(key, value);
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Save failed!");
            }
        }

        _timer.AddPoint("Characters");

        // Transferred currencies
        if (parsed.TransferCurrencies != null)
        {
            try
            {
                await HandleTransferCurrencies(Context, parsed.ScanTimes.EmptyIfNull(), parsed.TransferCurrencies);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "HandleTransferCurrencies failed!");
            }
        }

        // Deal with account data
        if (accountId > 0)
        {
            var accountAddonData = await Context.PlayerAccountAddonData.FindAsync(accountId);
            if (accountAddonData == null)
            {
                accountAddonData = new PlayerAccountAddonData
                {
                    AccountId = accountId,
                };
                Context.PlayerAccountAddonData.Add(accountAddonData);
            }

            accountAddonData.HonorCurrent = parsed.HonorCurrent;
            accountAddonData.HonorLevel = parsed.HonorLevel;
            accountAddonData.HonorMax = parsed.HonorMax;

            // Heirlooms
            // accountAddonData.Heirlooms ??= new();
            //
            // bool changedHeirlooms = false;
            // foreach (var heirloom in parsed.Heirlooms.EmptyIfNull())
            // {
            //     var heirloomParts = heirloom.Split(':');
            //     if (heirloomParts.Length == 3)
            //     {
            //         var itemId = int.Parse(heirloomParts[0]);
            //         var userHas = heirloomParts[1] == "1";
            //         var upgradeLevel = short.Parse(heirloomParts[2]);
            //
            //         if (userHas && upgradeLevel >= accountAddonData.Heirlooms.GetValueOrDefault(itemId))
            //         {
            //             accountAddonData.Heirlooms[itemId] = upgradeLevel;
            //             changedHeirlooms = true;
            //         }
            //     }
            // }
            //
            // if (changedHeirlooms)
            // {
            //     // Change detection for this is obnoxious, just update it
            //     Context.Entry(accountAddonData)
            //         .Property(ad => ad.Heirlooms)
            //         .IsModified = true;
            // }

            // Decor
            try
            {
                await HandleDecor(accountAddonData, parsed.ScanTimes.EmptyIfNull(), parsed.Decor);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "HandleDecor failed!");
            }

            // Illusions
            var newIllusions = parsed.Illusions.EmptyIfNull().Order().ToList();
            if (accountAddonData.Illusions == null || !newIllusions.SequenceEqual(accountAddonData.Illusions))
            {
                accountAddonData.Illusions = newIllusions;
                _resetTransmogCache = true;
            }

            // Quests
            List<int> questIds = parsed.QuestsV2?.Keys.ToList() ?? parsed.Quests.EmptyIfNull();
            var newQuests = questIds
                .EmptyIfNull()
                .Order()
                .ToList();

            if (accountAddonData.Quests == null || !newQuests.SequenceEqual(accountAddonData.Quests))
            {
                accountAddonData.Quests = newQuests;
                _resetQuestCache = true;
            }

            // Toys
            // var accountToys = await Context.PlayerAccountToys.FindAsync(accountId);
            // if (accountToys == null)
            // {
            //     accountToys = new PlayerAccountToys
            //     {
            //         AccountId = accountId,
            //     };
            //     Context.PlayerAccountToys.Add(accountToys);
            // }
            //
            // if (parsed.Toys?.Count > 0)
            // {
            //     accountToys.ToyIds = parsed.Toys
            //         .OrderBy(toyId => toyId)
            //         .ToList();
            // }

            // Transmog
            var accountTransmogIds = await Context.PlayerAccountTransmogIds.FindAsync(accountId);
            if (accountTransmogIds == null)
            {
                accountTransmogIds = new PlayerAccountTransmogIds
                {
                    AccountId = accountId,
                };
                Context.PlayerAccountTransmogIds.Add(accountTransmogIds);
            }

            var accountTransmogSources = await Context.PlayerAccountTransmogSources.FindAsync(accountId);
            if (accountTransmogSources == null)
            {
                accountTransmogSources = new PlayerAccountTransmogSources
                {
                    AccountId = accountId,
                };
                Context.PlayerAccountTransmogSources.Add(accountTransmogSources);
            }

            if (parsed.TransmogSourcesSquishV2 != null)
            {
                var imaCache = await MemoryCacheService.GetItemModifiedAppearances();
                var ids = new HashSet<int>();
                var sources = new List<string>();

                var itemModifiedAppearanceIds = SquishUtilities.Unsquish(parsed.TransmogSourcesSquishV2);
                foreach (int itemModifiedAppearanceId in itemModifiedAppearanceIds)
                {
                    if (imaCache.IdToItemIdAndModifier.TryGetValue(itemModifiedAppearanceId, out var itemIdAndModifier))
                    {
                        if (imaCache.ItemIdAndModifierToAppearanceId.TryGetValue(itemIdAndModifier, out int appearanceId))
                        {
                            ids.Add(appearanceId);
                        }

                        sources.Add($"{itemIdAndModifier.Item1}_{itemIdAndModifier.Item2}");
                    }
                    else
                    {
                        Logger.Warning("ItemModifiedAppearance {id} doesn't exist!", itemModifiedAppearanceId);
                    }
                }

                var sortedIds = ids.OrderBy(id => id).ToList();
                if (accountTransmogIds.Ids == null || !sortedIds.SequenceEqual(accountTransmogIds.Ids))
                {
                    accountTransmogIds.Ids = sortedIds;
                    _resetTransmogCache = true;
                }

                var sortedSources = sources
                    .OrderBy(source => int.Parse(source.Split('_').First()))
                    .ToList();
                if (accountTransmogSources.Sources == null || !sortedSources.SequenceEqual(accountTransmogSources.Sources))
                {
                    accountTransmogSources.Sources = sortedSources;
                    _resetTransmogCache = true;
                }
            }

            // Deal with warbank data last, we need to know the region
            if (accountRegion != null && parsed.Warbank?.Items != null)
            {
                try
                {
                    await HandleWarbank(accountRegion.Value, userAddonData, parsed.ScanTimes.EmptyIfNull(),
                        parsed.Warbank);
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "HandleWarbank failed!");
                }
            }

            if (parsed.BattlePets != null)
            {
                try
                {
                    await HandleBattlePets(accountId, parsed.BattlePets);
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "HandleBattlePets failed!");
                }
            }

            _timer.AddPoint("Account");
        }

        // Deal with world quest reports
        if (accountRegion.HasValue)
        {
            await HandleWorldQuestReports(accountRegion.Value, worldQuestReportMap);
        }

#if DEBUG
        //Context.ChangeTracker.DetectChanges();
        //Console.WriteLine(Context.ChangeTracker.DebugView.ShortView);
#endif

        if (updatedCharacters > 0)
        {
            Logger.Information("Updating {Count} character(s) immediately", updatedCharacters);
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, _userId);
        }

        if (_resetAchievementCache)
        {
            await CacheService.DeleteAchievementCacheAsync(_userId);
            Logger.Debug("Reset achievement cache");
        }

        if (_resetMountCache)
        {
            await JobRepository.AddJobAsync(JobPriority.High, JobType.UserCacheMounts, _userId.ToString());
            Logger.Debug("Regenerating mount cache");
        }

        if (_resetQuestCache)
        {
            await CacheService.DeleteQuestCacheAsync(_userId);
            Logger.Debug("Reset quest cache");
        }

        if (_resetTransmogCache)
        {
            await JobRepository.AddJobAsync(JobPriority.High, JobType.UserCacheTransmog, _userId.ToString());
            Logger.Debug("Regenerating transmog cache");
        }

        await Context.SaveChangesAsync();
        _timer.AddPoint("Save", true);
    }

    private (WowRealm, string) ParseAddonId(string addonId)
    {
        var parts = addonId.Split("/");
        if (parts.Length != 3)
        {
            Logger.Warning("Invalid addon id: {String}", addonId);
            return (null, null);
        }

        var region = Enum.Parse<WowRegion>(parts[0]);
        if (!_realmByRegionAndName.TryGetValue((region, parts[1]), out WowRealm realm) &&
            !_realmByRegionAndName.TryGetValue((region, parts[1].Slugify()), out realm))
        {
            Logger.Warning("Invalid realm: {0}/{1}", parts[0], parts[1]);
            return (null, null);
        }

        return (realm, parts[2]);
    }

    private async Task HandleBattlePets(int accountId, Dictionary<long, string> parsedBattlePets)
    {
        string lockKey = $"account_pets:{accountId}";
        string lockValue = Guid.NewGuid().ToString("N");
        bool lockSuccess = await JobRepository.AcquireLockAsync(lockKey, lockValue, TimeSpan.FromMinutes(1));
        if (!lockSuccess)
        {
            Logger.Information("Skipping pets, lock failed");
            return;
        }

        await using var localContext = await NewContext();

        var accountPets = await localContext.PlayerAccountPets.FindAsync(accountId);
        if (accountPets == null)
        {
            accountPets = new PlayerAccountPets(accountId);
            localContext.PlayerAccountPets.Add(accountPets);
        }

        accountPets.Pets ??= new();

        var seenIds = new HashSet<long>();
        foreach ((long petId, string petString) in parsedBattlePets)
        {
            // species:level:quality
            string[] parts = petString.Split(':');
            if (parts.Length is < 2 or > 3)
            {
                Logger.Warning("Invalid pet string: {s}", petString);
                continue;
            }

            int.TryParse(parts[0], out int speciesId);
            int.TryParse(parts[1], out int level);

            short quality = 0;
            if (parts.Length >= 3)
            {
                short.TryParse(parts[2], out quality);
            }

            if (!accountPets.Pets.TryGetValue(petId, out var pet))
            {
                accountPets.Pets.Add(petId, new PlayerAccountPetsPet
                {
                    BreedId = 0, // getting this out of the game sucks and I don't want to deal with it
                    FromAddon = true,
                    Level = Math.Min(25, level),
                    Quality = (WowQuality)quality,
                    SpeciesId = speciesId,
                });
            }
            else
            {
                pet.Level = Math.Min(25, Math.Max(pet.Level, level));
                if (quality > 0)
                {
                    pet.Quality = (WowQuality)quality;
                }
            }

            seenIds.Add(petId);
        }

        // Remove any pets that we didn't see, assume they've been caged
        foreach (long petId in accountPets.Pets.Keys.Except(seenIds))
        {
            accountPets.Pets.Remove(petId);
        }

        // Change detection for this is obnoxious, just update it
        var entry = localContext.Entry(accountPets);
        entry.Property(caq => caq.Pets).IsModified = true;

        await localContext.SaveChangesAsync(CancellationToken);

        await JobRepository.ReleaseLockAsync(lockKey, lockValue);
    }


    private async Task HandleDecor(PlayerAccountAddonData accountAddonData, Dictionary<string, int> globalScanTimes, Dictionary<int, string> decorData)
    {
        var localContext = Context;

        if (globalScanTimes.TryGetValue("decor", out int decorTimestamp))
        {
            var decorScannedAt = decorTimestamp.AsUtcDateTime();
            if (decorScannedAt > accountAddonData.DecorScannedAt)
            {
                accountAddonData.DecorScannedAt = decorScannedAt;
                accountAddonData.Decor ??= new();

                foreach ((int decorId, string values) in decorData)
                {
                    var valueParts = values.Split(';');
                    if (valueParts.Length == 2)
                    {
                        accountAddonData.Decor[decorId] =
                        [
                            int.Parse(valueParts[0]),
                            int.Parse(valueParts[1])
                        ];
                    }
                }

                // Change detection for this is obnoxious, just update it
                localContext.Entry(accountAddonData)
                    .Property(aad => aad.Decor)
                    .IsModified = true;

                await localContext.SaveChangesAsync(CancellationToken);
            }
        }
    }


    private async Task HandleGuildItems(WowDbContext localContext, PlayerGuild guild, UploadGuild guildData)
    {
        var guildItems = guild.Items.EmptyIfNull();
        var itemMap = guildItems.ToGroupedDictionary(pgi => (pgi.ContainerId, pgi.Slot));
        var itemIds = new HashSet<long>(guildItems.Select(item => item.Id));
        var seenIds = new HashSet<long>();

        // (tab, slot)
        foreach ((string tabString, var contents) in guildData.Items.EmptyIfNull())
        {
            short tab = short.Parse(tabString[1..]);
            foreach ((string slotString, string itemString) in contents)
            {
                if (itemString == "pet")
                {
                    continue;
                }

                short slot = short.Parse(slotString[1..]);

                string[] parts = itemString.Split(":");
                if (parts.Length != 10 && parts.Length != 12 && !(parts.Length == 4 && parts[0] == "pet"))
                {
                    Logger.Warning("Invalid guild item string: {count} {string}", parts.Length, itemString);
                    continue;
                }

                var key = (tab, slot);

                PlayerGuildItem item;
                if (!itemMap.TryGetValue(key, out var items))
                {
                    item = new PlayerGuildItem
                    {
                        Guild = guild,
                        ContainerId = tab,
                        Slot = slot,
                    };
                    localContext.PlayerGuildItem.Add(item);
                }
                else
                {
                    item = items.FirstOrDefault(pci => pci.ItemId == int.Parse(parts[1])) ?? items.First();
                    seenIds.Add(item.Id);
                }

                AddItemDetails(item, parts);
            }
        }

        await localContext.SaveChangesAsync(CancellationToken);

        long[] deleteMe = itemIds
            .Except(seenIds)
            .ToArray();
        if (deleteMe.Length > 0)
        {
            await localContext.PlayerGuildItem
                .Where(pgi => deleteMe.Contains(pgi.Id))
                .ExecuteDeleteAsync();
        }
    }

    private async Task HandleTransferCurrencies(
        WowDbContext localContext,
        Dictionary<string, int> globalScanTimes,
        Dictionary<short, List<string>> transferCurrencies
    ) {
        if (!globalScanTimes.TryGetValue("transferCurrencies", out int transferTimestamp))
        {
            return;
        }

        var transferredAt = transferTimestamp.AsUtcDateTime();
        var characterIdToAddonData = await localContext.PlayerCharacterAddonData
            .Where(pcad => pcad.Character.Account.UserId == _userId)
            .Select(pcad => new { AddonData = pcad, CharacterId = pcad.Character.CharacterId })
            .ToDictionaryAsync(
                oof => oof.CharacterId,
                oof => oof.AddonData
            );

        // hex_character_id:value
        // 777 => [ "0A50BEBC:28954", "0B742844:17996" ]
        foreach (var (currencyId, valueStrings) in transferCurrencies.OrderBy(kvp => kvp.Key))
        {
            var seenCharacterIds = new HashSet<long>();
            foreach (string valueString in valueStrings)
            {
                var valueParts = valueString.Split(":");
                if (valueParts.Length != 2)
                {
                    continue;
                }

                if (!long.TryParse(valueParts[0], NumberStyles.HexNumber, CultureInfo.InvariantCulture,
                        out long characterId) ||
                    !int.TryParse(valueParts[1], out int value))
                {
                    Logger.Debug("something failed to parse");
                    continue;
                }

                seenCharacterIds.Add(characterId);

                if (!characterIdToAddonData.TryGetValue(characterId, out var characterAddonData) ||
                    characterAddonData.CurrenciesScannedAt > transferredAt ||
                    characterAddonData.CurrenciesTransferredAt > transferredAt ||
                    characterAddonData.Currencies == null)
                {
                    continue;
                }

                bool changed = false;
                if (!characterAddonData.Currencies.TryGetValue(currencyId, out var playerCurrency))
                {
                    characterAddonData.Currencies[currencyId] = new PlayerCharacterAddonDataCurrency
                    {
                        CurrencyId = currencyId,
                        Quantity = value,
                    };
                    changed = true;
                    Logger.Debug("new currency: {0} => {1}", characterAddonData.CharacterId, value);
                }
                else if (playerCurrency.Quantity != value)
                {
                    Logger.Debug("updated currency: {0} {q} => {v}", characterAddonData.CharacterId, playerCurrency.Quantity, value);
                    playerCurrency.Quantity = value;
                    changed = true;
                }

                // Change detection for this is obnoxious, just update it
                if (changed)
                {
                    characterAddonData.CurrenciesTransferredAt = transferredAt;
                    localContext.Entry(characterAddonData)
                        .Property(pcad => pcad.Currencies)
                        .IsModified = true;
                }
            }

            foreach (var (characterId, characterAddonData) in characterIdToAddonData)
            {
                if (seenCharacterIds.Contains(characterId))
                {
                    continue;
                }

                if (characterAddonData.CurrenciesScannedAt > transferredAt ||
                    characterAddonData.CurrenciesTransferredAt > transferredAt ||
                    characterAddonData.Currencies == null)
                {
                    continue;
                }

                bool changed = false;
                if (!characterAddonData.Currencies.TryGetValue(currencyId, out var playerCurrency))
                {
                    characterAddonData.Currencies[currencyId] = new PlayerCharacterAddonDataCurrency
                    {
                        CurrencyId = currencyId,
                        Quantity = 0,
                    };
                    changed = true;
                    Logger.Debug("new currency: {0} => {1}", characterAddonData.CharacterId, 0);
                }
                else if (playerCurrency.Quantity > 0)
                {
                    Logger.Debug("updated currency: {0} {q} => {v}", characterAddonData.CharacterId, playerCurrency.Quantity, 0);
                    playerCurrency.Quantity = 0;
                    changed = true;
                }

                // Change detection for this is obnoxious, just update it
                if (changed)
                {
                    characterAddonData.CurrenciesTransferredAt = transferredAt;
                    localContext.Entry(characterAddonData)
                        .Property(pcad => pcad.Currencies)
                        .IsModified = true;
                }
            }
        }
    }

    private async Task HandleWarbank(WowRegion accountRegion, UserAddonData userAddonData,
        Dictionary<string, int> globalScanTimes, UploadWarbank warbankData)
    {
        await using var localContext = await ContextFactory.CreateDbContextAsync();

        if (globalScanTimes.TryGetValue("warbankGold", out int warbankGoldTimestamp))
        {
            var warbankGoldScannedAt = warbankGoldTimestamp.AsUtcDateTime();
            if (warbankGoldScannedAt > userAddonData.WarbankGoldUpdatedAt)
            {
                userAddonData.WarbankGoldUpdatedAt = warbankGoldScannedAt;
                userAddonData.WarbankCopper = warbankData.Copper;
            }
        }

        long[] deleteItemIds = [];

        var warbankScannedAt = warbankData.ScannedAt.AsUtcDateTime();
        if (warbankScannedAt > userAddonData.WarbankUpdatedAt)
        {
            userAddonData.WarbankUpdatedAt = warbankScannedAt;

            var itemMap = await localContext.PlayerWarbankItem
                .Where(item => item.UserId == _userId)
                .ToDictionaryAsync(item => (item.ContainerId, item.Slot));

            var existingIds = new HashSet<long>(itemMap.Values.Select(item => item.Id));
            var seenIds = new HashSet<long>();

            foreach ((string bagString, var contents) in warbankData.Items)
            {
                // Warbank is bags 13-17
                short tabId = (short)(short.Parse(bagString[1..]) - 12);
                foreach ((string slotString, string itemString) in contents)
                {
                    short slot = short.Parse(slotString[1..]);

                    string[] parts = itemString.Split(":");
                    if (parts.Length < 9 && !(parts.Length == 4 && parts[0] == "pet"))
                    {
                        Logger.Warning("Invalid warbank item string: {String}", itemString);
                        continue;
                    }

                    var key = (tabId, slot);
                    if (!itemMap.TryGetValue(key, out var item))
                    {
                        item = new PlayerWarbankItem
                        {
                            UserId = _userId,
                            Region = accountRegion,
                            ContainerId = tabId,
                            Slot = slot,
                        };
                        localContext.PlayerWarbankItem.Add(item);
                    }
                    else
                    {
                        seenIds.Add(item.Id);
                    }

                    AddItemDetails(item, parts);
                }
            }

            deleteItemIds = existingIds
                .Except(seenIds)
                .ToArray();
        }

        await localContext.SaveChangesAsync();

        if (deleteItemIds.Length > 0)
        {
            await localContext.PlayerWarbankItem
                .Where(pgi => deleteItemIds.Contains(pgi.Id))
                .ExecuteDeleteAsync();
        }
    }

    private async Task HandleWorldQuestReports(WowRegion accountRegion,
        Dictionary<WorldQuestReportKey, WorldQuestReport> newReports)
    {
        await using var localContext = await ContextFactory.CreateDbContextAsync();

        var reportMap = (
                await localContext.WorldQuestReport
                    .Where(wqr => wqr.UserId == _userId && wqr.Region == (short)accountRegion)
                    .ToArrayAsync()
            )
            .GroupBy(wqr => new WorldQuestReportKey(
                wqr.Expansion,
                wqr.ZoneId,
                wqr.QuestId,
                wqr.Faction,
                wqr.Class
            ))
            .ToDictionary(
                group => group.Key,
                group => group.OrderByDescending(wqr => wqr.ExpiresAt).First()
            );

        foreach (var (key, newReport) in newReports)
        {
            if (!reportMap.TryGetValue(key, out var dbReport))
            {
                reportMap[key] = newReport;
                newReport.UserId = _userId;
                localContext.WorldQuestReport.Add(newReport);
            }
            else
            {
                dbReport.ExpiresAt = newReport.ExpiresAt;
                dbReport.ReportedAt = newReport.ReportedAt;
                dbReport.Rewards = newReport.Rewards;
            }
        }

        await localContext.SaveChangesAsync();
    }

    public static void AddItemDetails(BasePlayerItem item, string[] parts)
    {
        if (parts[0] == "pet")
        {
#pragma warning disable CA1806
            short.TryParse(parts[1], out short context);
            short.TryParse(parts[2], out short itemLevel);
            short.TryParse(parts[3], out short quality);
#pragma warning restore CA1806

            // pet:speciesId:level:quality
            item.Count = 1;
            item.ItemId = 82800; // Pet Cage
            item.Context = context;
            item.ItemLevel = itemLevel;
            item.Quality = quality;
            item.BonusIds = new List<short>();
            item.Gems = new List<int>();
        }
        else
        {
#pragma warning disable CA1806
            short.TryParse(parts[2].OrDefault("0"), out short context);
            short.TryParse(parts[3].OrDefault("0"), out short enchantId);
            short.TryParse(parts[4].OrDefault("0"), out short itemLevel);
            short.TryParse(parts[5].OrDefault("0"), out short quality);
            short.TryParse(parts[6].OrDefault("0"), out short suffixId);
#pragma warning restore CA1806

            // count:id:context:enchant:itemLevel:quality:suffix:bonusIDs:gems:modifiers:bound?:bindType
            item.Count = int.Parse(parts[0]);
            item.ItemId = int.Parse(parts[1]);
            item.Context = context;
            item.EnchantId = enchantId;
            item.ItemLevel = itemLevel;
            item.Quality = quality;
            item.SuffixId = suffixId;

            item.BonusIds = parts[7]
                .EmptyIfNullOrWhitespace()
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(short.Parse)
                .ToList();

            item.Gems = parts[8]
                .EmptyIfNullOrWhitespace()
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToList();

            if (parts.Length >= 10)
            {
                item.CraftedQuality = GetCraftedQuality(parts[9]);
                item.Modifiers = parts[9]
                    .EmptyIfNullOrWhitespace()
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(value => value.Split('_'))
                    .ToDictionary(key => int.Parse(key[0]), value => int.Parse(value[0]));

                if (parts.Length == 12)
                {
                    short.TryParse(parts[10].OrDefault("0"), out short bound);
                    short.TryParse(parts[11].OrDefault("0"), out short bindType);
                    item.Bound = bound == 1;
                    item.BindType = bindType;
                }
            }
        }
    }

    public static short GetCraftedQuality(string packedModifiers)
    {
        var modifiers = packedModifiers
            .EmptyIfNullOrWhitespace()
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .ToDictionary(
                pair => int.Parse(pair.Split('_')[0]),
                pair => int.Parse(pair.Split('_')[1])
            );

        // Crafted quality
        if (modifiers.TryGetValue(38, out int craftedQuality))
        {
            return craftedQuality switch
            {
                <= 3 => (short)craftedQuality,
                <= 8 => (short)(craftedQuality - 3),
                _ => (short)(craftedQuality & 0x7FFF)
            };
        }

        return 0;
    }

    public class EmissaryData
    {
        public int QuestId { get; set; }
        public UploadCharacterEmissaryReward NewReward { get; set; }
        public GlobalDailiesReward OldReward { get; set; }
    }
}
