using Wowthing.Backend.Data;
using Wowthing.Backend.Models.Uploads;
using Wowthing.Lib.Comparers;
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
    private Dictionary<(WowRegion Region, string Name), WowRealm> _realmMap;
    private Dictionary<string, int> _instanceNameToIdMap;
    private Dictionary<short, Dictionary<(short Expansion, int ZoneId, int QuestId, short Faction, short Class), WorldQuestReport>> _worldQuestReportMap;

    private static readonly DictionaryComparer<int, PlayerCharacterAddonAchievementsAchievement> _achievementComparer =
        new(new PlayerCharacterAddonAchievementsAchievementComparer());

    private readonly HashSet<string> _fortifiedNames = new()
    {
        "Verstärkt", // deDE
        "Fortified", // enGB/enUS
        "Reforzada", // esES
        "Reforzado", // esMX
        "Fortifié", // frFR
        "Potenziamento", // itIT
        "Fortificada", // ptBR/ptPT
        "Укрепленный", // ruRU
        "경화", // koKR
        "强韧", // zhCN
        "強悍", // zhTW
    };

    private static readonly HashSet<int> BankBags = new()
    {
        -3, // Reagent Bank
        -1, // Bank
        6, // Bank bag 1
        7, // Bank bag 2
        8, // Bank bag 3
        9, // Bank bag 4
        10, // Bank bag 5
        11, // Bank bag 6
        12, // Bank bag 7
    };

    private static readonly HashSet<int> PlayerBags = new()
    {
        0, // Backpack
        1, // Bag 1
        2, // Bag 2
        3, // Bag 3
        4, // Bag 4
        5, // Reagent bag
    };

    private static readonly AsyncRetryPolicy<bool> LockRetryPolicy = Policy
        .HandleResult<bool>(r => r == false)
        .WaitAndRetryAsync(
            retryCount: 20,
            retryNumber => TimeSpan.FromMilliseconds(250)
        );

    public override async Task Run(params string[] data)
    {
        _timer = new JankTimer();

        _userId = long.Parse(data[0]);
        using var shrug = UserLog(_userId);

        Logger.Information("Processing upload...");

        string lockKey = $"user_upload:{_userId}";
        string lockValue = Guid.NewGuid().ToString("N");
        try
        {
            // Attempt to get exclusive scheduler lock
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

        try
        {
            await Process(data[1]);
        }
        finally
        {
            await JobRepository.ReleaseLockAsync(lockKey, lockValue);
        }

        Logger.Information("{Timer}", _timer.ToString());
    }

    public async Task Process(string luaData) {
        _instanceNameToIdMap = (await MemoryCacheService.GetJournalInstanceMap())
            .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

        _realmMap = (await MemoryCacheService.GetRealmMap())
            .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

        var trustedRole = await MemoryCacheService.GetTrustedRole();
        bool hasTrustedRole = await Context.UserRoles
            .Where(ur => ur.UserId == _userId && ur.RoleId == trustedRole)
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

        _worldQuestReportMap = (
                await Context.WorldQuestReport
                    .Where(wqr => wqr.UserId == _userId)
                    .ToArrayAsync()
            )
            .GroupBy(wqr => wqr.Region)
            .ToDictionary(
                group => group.Key,
                group => group.ToDictionary(wqr => (
                    wqr.Expansion,
                    wqr.ZoneId,
                    wqr.QuestId,
                    wqr.Faction,
                    wqr.Class
                ))
            );

        _timer.AddPoint("Load");

        var json = LuaToJsonConverter4
            .Convert(luaData.Replace("WWTCSaved = ", ""))[1..^1];
        _timer.AddPoint("Convert");

#if DEBUG
        await File.WriteAllTextAsync(Path.Join("..", "..", "lua.json"), json);
        _timer.AddPoint("Write");
#endif

        //var parsed = JsonConvert.DeserializeObject<Upload[]>(json)[0]; // TODO work out why this is an array of objects
        var parsed = System.Text.Json.JsonSerializer.Deserialize<Upload>(json, JsonSerializerOptions);
        _timer.AddPoint("Parse");

        // Fetch guild data
        var guildMap = await Context.PlayerGuild
            .Where(pg => pg.UserId == _userId)
            .Include(pg => pg.Items)
            .ToDictionaryAsync(pg => (pg.RealmId, pg.Name));

        // Deal with guild data
        foreach (var (addonId, guildData) in parsed.Guilds.EmptyIfNull())
        {
            var (realm, guildName) = ParseAddonId(addonId);
            if (realm == null)
            {
                continue;
            }

            if (!guildMap.TryGetValue((realm.Id, guildName), out var guild))
            {
                guild = guildMap[(realm.Id, guildName)] = new PlayerGuild
                {
                    UserId = _userId,
                    RealmId = realm.Id,
                    Name = guildName,
                };
                Context.PlayerGuild.Add(guild);
            }

            await HandleGuildItems(guild, guildData);
        }

        await Context.SaveChangesAsync();

        _timer.AddPoint("Guilds");

        // Build a fancy set of character ORs
        var characterPredicate = PredicateBuilder.False<PlayerCharacter>();
        foreach (var (addonId, characterData) in parsed.Characters.EmptyIfNull())
        {
            var (realm, characterName) = ParseAddonId(addonId);
            if (realm == null)
            {
                continue;
            }

            var lastSeen = characterData.LastSeen.AsUtcDateTime();
            characterPredicate = characterPredicate.Or(pc =>
                pc.RealmId == realm.Id &&
                pc.Name == characterName &&
                pc.LastSeenAddon < lastSeen
            );
        }

        // Fetch character data
        var characterMap = await Context.PlayerCharacter
            .Where(c => c.Account.UserId == _userId)
            .Where(characterPredicate)
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
            .AsSplitQuery()
            .ToDictionaryAsync(k => (k.RealmId, k.Name));

        _timer.AddPoint("Load");

        // Deal with character data
        int accountId = 0;
        int updatedCharacters = 0;
        foreach (var (addonId, characterData) in parsed.Characters.EmptyIfNull())
        {
            // US/Mal'Ganis/Fakenamehere
            var (realm, characterName) = ParseAddonId(addonId);
            if (realm == null)
            {
                continue;
            }

            if (!characterMap.TryGetValue((realm.Id, characterName), out PlayerCharacter character))
            {
                //Logger.Warning("Invalid character: {AddonId}", addonId);
                continue;
            }

            //Logger.Debug("Found character: {0} => {1}", addonId, character.Id);
            accountId = character.AccountId!.Value;
            var lastSeen = characterData.LastSeen.AsUtcDateTime();

            character.LastSeenAddon = lastSeen;

            character.ChromieTime = characterData.ChromieTime;
            character.Copper = characterData.Copper;
            character.IsResting = characterData.IsResting;
            character.IsWarMode = characterData.IsWarMode;
            character.PlayedTotal = characterData.PlayedTotal;
            character.RestedExperience = characterData.RestedXp;

            character.GuildId = null;
            if (!string.IsNullOrWhiteSpace(characterData.GuildName))
            {
                var (guildRealm, guildName) = ParseAddonId(characterData.GuildName);
                if (guildRealm != null && guildMap.TryGetValue((guildRealm.Id, guildName), out var guild))
                {
                    character.GuildId = guild.Id;
                }
            }

            if (character.AddonData == null)
            {
                character.AddonData = new PlayerCharacterAddonData
                {
                    CharacterId = character.Id,
                };
                Context.PlayerCharacterAddonData.Add(character.AddonData);
            }

            HandleAddonData(character, characterData);

            HandleAchievements(character, characterData);
            HandleCovenants(character, characterData);

            await HandleItems(character, characterData);
            HandleLockouts(character, characterData);
            HandleMounts(character, characterData);
            //HandleMythicPlus(character, characterData);
            HandleProfessionCooldowns(character, characterData);
            HandleProfessionTraits(character, characterData);
            HandleQuests(character, characterData, realm.Region);
            HandleReputations(character, characterData);
            HandleTransmog(character, characterData);
            HandleWeekly(character, characterData);

            if (lastSeen > character.LastApiCheck)
            {
                character.LastApiCheck = MiscConstants.DefaultDateTime;
                updatedCharacters++;
            }

            Logger.Warning("Saving character {id} {addonId}", character.Id, addonId);
            await Context.SaveChangesAsync();
        }

        _timer.AddPoint("Characters");

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

            // Quests
            var newQuests = parsed.Quests
                .EmptyIfNull()
                .OrderBy(q => q)
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
            var accountTransmogSources = await Context.PlayerAccountTransmogSources.FindAsync(accountId);
            if (accountTransmogSources == null)
            {
                accountTransmogSources = new PlayerAccountTransmogSources
                {
                    AccountId = accountId,
                };
                Context.PlayerAccountTransmogSources.Add(accountTransmogSources);
            }

            if (parsed.TransmogSources?.Count > 0)
            {
                accountTransmogSources.Sources = parsed.TransmogSources
                    .Keys
                    .OrderBy(key => key)
                    .ToList();
            }

        }
        _timer.AddPoint("Account");

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

        Logger.Warning("Trying to save");

        await Context.SaveChangesAsync();
        _timer.AddPoint("Save", true);
    }

    private (WowRealm, string) ParseAddonId(string addonId)
    {
        var parts = addonId.Split("/");
        if (parts.Length != 3)
        {
            Logger.Warning("Invalid guild key: {String}", addonId);
            return (null, null);
        }

        var region = Enum.Parse<WowRegion>(parts[0]);
        if (!_realmMap.TryGetValue((region, parts[1]), out WowRealm realm))
        {
            Logger.Warning("Invalid realm: {0}/{1}", parts[0], parts[1]);
            return (null, null);
        }

        return (realm, parts[2]);
    }

    private void HandleAddonData(PlayerCharacter character, UploadCharacter characterData)
    {
        character.AddonData.Level = characterData.Level;
        character.AddonData.LevelXp = characterData.LevelXp;

        if (!string.IsNullOrWhiteSpace(characterData.BindLocation))
        {
            character.AddonData.BindLocation = characterData.BindLocation.Truncate(64);
        }

        if (!string.IsNullOrWhiteSpace(characterData.CurrentLocation))
        {
            character.AddonData.CurrentLocation = characterData.CurrentLocation.Truncate(64);
        }

        if (characterData.AurasV2 != null)
        {
            character.AddonData.Auras = characterData.AurasV2
                .Select(aura => aura.Split(':'))
                .ToDictionary(parts => int.Parse(parts[0]), parts => int.Parse(parts[1]));
        }
        else
        {
            character.AddonData.Auras = characterData.Auras
                .EmptyIfNull()
                .ToDictionary(auraId => auraId, _ => 0);
        }

        // Currencies
        character.AddonData.Currencies = new();
        foreach (var (currencyId, currencyString) in characterData.Currencies.EmptyIfNull())
        {
            // quantity:max:isWeekly:weekQuantity:weekMax:isMovingMax:totalQuantity
            var parts = currencyString.Split(":");
            if (parts.Length != 7)
            {
                Logger.Warning("Invalid currency string: {String}", currencyString);
                continue;
            }

            if (!character.AddonData.Currencies.TryGetValue(currencyId, out var currency))
            {
                character.AddonData.Currencies[currencyId] = currency = new PlayerCharacterAddonDataCurrency
                {
                    CurrencyId = currencyId,
                };
            }

            currency.Quantity = int.Parse(parts[0].OrDefault("0"));
            currency.Max = int.Parse(parts[1].OrDefault("0"));
            currency.IsWeekly = parts[2] == "1";
            currency.WeekQuantity = int.Parse(parts[3].OrDefault("0"));
            currency.WeekMax = int.Parse(parts[4].OrDefault("0"));
            currency.IsMovingMax = parts[5] == "1";
            currency.TotalQuantity = int.Parse(parts[6].OrDefault("0"));
        }

        // Equipment
        character.AddonData.EquippedItems = new();
        foreach ((int slot, string itemString) in characterData.Equipment.EmptyIfNull())
        {
            var parts = itemString.Split(":");
            if (parts.Length != 9 && parts.Length != 10)
            {
                Logger.Warning("Invalid equipped item string: {count} {string}", parts.Length, itemString);
                continue;
            }

            short.TryParse(parts[2].OrDefault("0"), out short context);
            short.TryParse(parts[3].OrDefault("0"), out short enchantId);
            short.TryParse(parts[4].OrDefault("0"), out short itemLevel);
            short.TryParse(parts[5].OrDefault("0"), out short quality);
            short.TryParse(parts[6].OrDefault("0"), out short suffixId);

            var item = character.AddonData.EquippedItems[slot] = new();

            // count:id:context:enchant:ilvl:quality:suffix:bonusIDs:gems
            item.ItemId = int.Parse(parts[1]);
            item.Context = context;
            item.ItemLevel = itemLevel;
            item.Quality = (WowQuality)quality;

            item.EnchantmentIds = new();
            if (enchantId > 0)
            {
                item.EnchantmentIds.Add(enchantId);
            }

            item.BonusIds = parts[7]
                .EmptyIfNullOrWhitespace()
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToList();

            item.GemIds = parts[8]
                .EmptyIfNullOrWhitespace()
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToList();

            if (parts.Length >= 10)
            {
                item.CraftedQuality = GetCraftedQuality(parts[9]);
            }
        }

        // Garrisons
        character.AddonData.Garrisons ??= new();
        foreach (var dataGarrison in characterData.Garrisons.EmptyIfNull())
        {
            var scanTime = dataGarrison.ScannedAt.AsUtcDateTime();
            if (!character.AddonData.Garrisons.TryGetValue(dataGarrison.Type, out var dbGarrison))
            {
                dbGarrison = character.AddonData.Garrisons[dataGarrison.Type] = new PlayerCharacterAddonDataGarrison
                {
                    Type = dataGarrison.Type,
                };
            }
            else if (scanTime < dbGarrison.ScannedAt)
            {
                continue;
            }

            dbGarrison.Level = Math.Max(dbGarrison.Level, dataGarrison.Level);
            dbGarrison.ScannedAt = scanTime;
            dbGarrison.Buildings = dataGarrison.Buildings
                .EmptyIfNull()
                .Select(building => new PlayerCharacterAddonDataGarrisonBuilding
                {
                    BuildingId = building.BuildingId,
                    PlotId = building.PlotId,
                    Rank = building.Rank,
                    Name = building.Name.Truncate(64),
                })
                .ToList();
        }

        // Garrison Trees
        if (characterData.GarrisonTrees != null &&
            characterData.ScanTimes.TryGetValue("garrisonTrees", out int garrisonTreesTimestamp))
        {
            var scanTime = garrisonTreesTimestamp.AsUtcDateTime();
            if (scanTime > character.AddonData.GarrisonTreesScannedAt)
            {
                character.AddonData.GarrisonTrees = new();
                character.AddonData.GarrisonTreesScannedAt = scanTime;

                foreach (var (key, packedData) in characterData.GarrisonTrees)
                {
                    if (!int.TryParse(key, out int treeId))
                    {
                        continue;
                    }

                    if (!character.AddonData.GarrisonTrees.TryGetValue(treeId, out var tree))
                    {
                        tree = character.AddonData.GarrisonTrees[treeId] = new Dictionary<int, List<int>>();
                    }

                    var unpacked = new List<(int, int, int)>();

                    foreach (var packed in packedData)
                    {
                        var parts = packed.Split(':');
                        if (parts.Length == 3)
                        {
                            unpacked.Add((
                                int.Parse(parts[0]), // id
                                int.Parse(parts[1]), // rank
                                int.Parse(parts[2])  // research time
                            ));
                        }
                    }

                    if (unpacked.Sum(packed => packed.Item2) == 0)
                    {
                        continue;
                    }

                    foreach (var (talentId, talentRank, talentResearch) in unpacked)
                    {
                        if (!tree.ContainsKey(talentId) || tree[talentId][0] < talentRank)
                        {
                            tree[talentId] = new List<int>
                            {
                                talentRank,
                                talentResearch,
                            };
                        }
                    }
                }
            }
        }

        // Mythic Plus
        if ((characterData.MythicPlus != null || characterData.MythicPlusV2 != null) &&
            characterData.ScanTimes.TryGetValue("mythicPlus", out int mythicPlusTimestamp))
        {
            var scanTime = mythicPlusTimestamp.AsUtcDateTime();
            if (scanTime > character.AddonData.MythicPlusScannedAt)
            {
                character.AddonData.MythicPlusScannedAt = scanTime;

                // V1 data
                if (characterData.MythicPlus != null)
                {
                    if (character.AddonData.MythicPlus == null)
                    {
                        character.AddonData.MythicPlus = new();
                    }

                    var season = character.AddonData.MythicPlus[characterData.MythicPlus.Season] = new();

                    foreach (var map in characterData.MythicPlus.Maps.EmptyIfNull())
                    {
                        var mapData = season.Maps[map.MapId] = new PlayerCharacterAddonDataMythicPlusMap();
                        mapData.OverallScore = map.OverallScore;

                        foreach (var mapScore in map.AffixScores.EmptyIfNull())
                        {
                            if (_fortifiedNames.Contains(mapScore.Name))
                            {
                                mapData.FortifiedScore = new PlayerCharacterAddonDataMythicPlusScore
                                {
                                    OverTime = mapScore.OverTime,
                                    DurationSec = mapScore.DurationSec,
                                    Level = mapScore.Level,
                                    Score = mapScore.Score,
                                };
                            }
                            else
                            {
                                mapData.TyrannicalScore = new PlayerCharacterAddonDataMythicPlusScore
                                {
                                    OverTime = mapScore.OverTime,
                                    DurationSec = mapScore.DurationSec,
                                    Level = mapScore.Level,
                                    Score = mapScore.Score,
                                };
                            }
                        }
                    }

                    foreach (var runString in characterData.MythicPlus.Runs.EmptyIfNull())
                    {
                        var runParts = runString.Split(':');
                        season.Runs.Add(new PlayerCharacterAddonDataMythicPlusRun
                        {
                            MapId = int.Parse(runParts[0]),
                            Completed = runParts[1] == "1",
                            Level = int.Parse(runParts[2]),
                            Score = int.Parse(runParts[3]),
                        });
                    }
                }

                // V2 data
                if (characterData.MythicPlusV2 != null)
                {
                    // Seasons
                    if (character.AddonData.MythicPlusSeasons == null)
                    {
                        character.AddonData.MythicPlusSeasons = new();
                    }

                    foreach (var (seasonId, maps) in characterData.MythicPlusV2.Seasons.EmptyIfNull())
                    {
                        var season = character.AddonData.MythicPlusSeasons[seasonId] = new();

                        foreach (var map in maps)
                        {
                            var mapData = season[map.MapId] = new PlayerCharacterAddonDataMythicPlusMap();
                            mapData.OverallScore = map.OverallScore;

                            foreach (var mapScore in map.AffixScores.EmptyIfNull())
                            {
                                if (_fortifiedNames.Contains(mapScore.Name))
                                {
                                    mapData.FortifiedScore = new PlayerCharacterAddonDataMythicPlusScore
                                    {
                                        OverTime = mapScore.OverTime,
                                        DurationSec = mapScore.DurationSec,
                                        Level = mapScore.Level,
                                        Score = mapScore.Score,
                                    };
                                }
                                else
                                {
                                    mapData.TyrannicalScore = new PlayerCharacterAddonDataMythicPlusScore
                                    {
                                        OverTime = mapScore.OverTime,
                                        DurationSec = mapScore.DurationSec,
                                        Level = mapScore.Level,
                                        Score = mapScore.Score,
                                    };
                                }
                            }
                        }
                    }

                    // Migrate any old data
                    foreach (var (season, data) in character.AddonData.MythicPlus.EmptyIfNull())
                    {
                        if (!character.AddonData.MythicPlusSeasons.ContainsKey(season))
                        {
                            character.AddonData.MythicPlusSeasons[season] = data.Maps;
                        }
                    }

                    // Weeks
                    character.AddonData.MythicPlusWeeks ??= new();

                    foreach (var (weekEnds, runStrings) in characterData.MythicPlusV2.Weeks.EmptyIfNull())
                    {
                        var week = character.AddonData.MythicPlusWeeks[weekEnds] = new();
                        foreach (string runString in runStrings)
                        {
                            string[] runParts = runString.Split(':');
                            week.Add(new PlayerCharacterAddonDataMythicPlusRun
                            {
                                MapId = int.Parse(runParts[0]),
                                Completed = runParts[1] == "1",
                                Level = int.Parse(runParts[2]),
                                Score = int.Parse(runParts[3]),
                            });
                        }
                    }
                }
            }
        }

        // Change detection for this is obnoxious, just update it
        var entry = Context.Entry(character.AddonData);
        entry.Property(ad => ad.Garrisons).IsModified = true;
        entry.Property(ad => ad.MythicPlusSeasons).IsModified = true;
        entry.Property(ad => ad.MythicPlusWeeks).IsModified = true;
    }

    private void HandleAchievements(PlayerCharacter character, UploadCharacter characterData)
    {
        // Basic sanity checks
        if (characterData.Achievements == null || !characterData.ScanTimes.TryGetValue("achievements", out int scanTimestamp))
        {
            return;
        }

        if (character.AddonAchievements == null)
        {
            character.AddonAchievements = new PlayerCharacterAddonAchievements
            {
                Character = character,
            };
            Context.PlayerCharacterAddonAchievements.Add(character.AddonAchievements);
        }

        var scanTime = scanTimestamp.AsUtcDateTime();
        if (scanTime <= character.AddonAchievements.ScannedAt)
        {
            return;
        }

        var newAchievements = characterData.Achievements
            .EmptyIfNull()
            .ToDictionary(
                ach => ach.Id,
                ach => new PlayerCharacterAddonAchievementsAchievement
                {
                    Earned = ach.Earned,
                    Criteria = ach.Criteria,
                }
            );

        if (!_achievementComparer.Equals(character.AddonAchievements.Achievements.EmptyIfNull(), newAchievements))
        {
            character.AddonAchievements.ScannedAt = scanTime;
            character.AddonAchievements.Achievements = characterData.Achievements
                .ToDictionary(
                    ach => ach.Id,
                    ach => new PlayerCharacterAddonAchievementsAchievement
                    {
                        Earned = ach.Earned,
                        Criteria = ach.Criteria,
                    }
                );

            _resetAchievementCache = true;
        }
    }

    private void HandleCovenants(PlayerCharacter character, UploadCharacter characterData)
    {
        if (character.Shadowlands == null)
        {
            character.Shadowlands = new PlayerCharacterShadowlands()
            {
                CharacterId = character.Id,
            };
            Context.PlayerCharacterShadowlands.Add(character.Shadowlands);
        }

        if (characterData.ActiveCovenantId > 0)
        {
            character.Shadowlands.CovenantId = characterData.ActiveCovenantId;
        }

        character.Shadowlands.Covenants ??= new();

        foreach (var covenantData in characterData.Covenants.EmptyIfNull())
        {
            if (!character.Shadowlands.Covenants.TryGetValue(covenantData.Id, out var covenant))
            {
                covenant = character.Shadowlands.Covenants[covenantData.Id] = new PlayerCharacterShadowlandsCovenant();
            }

            covenant.Anima = Math.Max(0, covenantData.Anima);
            covenant.Renown = Math.Max(0, Math.Min(80, covenantData.Renown));
            covenant.Souls = Math.Max(0, Math.Min(100, covenantData.Souls));

            covenant.Soulbinds = HandleCovenantsSoulbinds(covenant.Soulbinds, covenantData.Soulbinds);

            covenant.Conductor = HandleCovenantsFeature(covenant.Conductor, covenantData.Conductor);
            covenant.Missions = HandleCovenantsFeature(covenant.Missions, covenantData.Missions);
            covenant.Transport = HandleCovenantsFeature(covenant.Transport, covenantData.Transport);
            covenant.Unique = HandleCovenantsFeature(covenant.Unique, covenantData.Unique);
        }

        // Change detection for this is obnoxious, just update it
        Context.Entry(character.Shadowlands)
            .Property(cs => cs.Covenants)
            .IsModified = true;
    }

    private PlayerCharacterShadowlandsCovenantFeature HandleCovenantsFeature(
        PlayerCharacterShadowlandsCovenantFeature feature,
        UploadCharacterCovenantFeature featureData
    )
    {
        if (featureData == null)
        {
            return feature;
        }

        return new PlayerCharacterShadowlandsCovenantFeature
        {
            Rank = Math.Max(feature?.Rank ?? 0, Math.Max(0, Math.Min(5, featureData.Rank))),
            ResearchEnds = featureData.ResearchEnds ?? 0,
            Name = featureData.Name.EmptyIfNullOrWhitespace().Truncate(32),
        };
    }

    private List<PlayerCharacterShadowlandsCovenantSoulbind> HandleCovenantsSoulbinds(
        List<PlayerCharacterShadowlandsCovenantSoulbind> soulbinds,
        List<UploadCharacterCovenantSoulbind> soulbindsData)
    {
        var soulbindMap = soulbinds
            .EmptyIfNull()
            .ToDictionary(soulbind => soulbind.Id);

        foreach (var soulbindData in soulbindsData.EmptyIfNull())
        {
            if (!soulbindMap.TryGetValue(soulbindData.Id, out var soulbind))
            {
                soulbind = soulbindMap[soulbindData.Id] = new PlayerCharacterShadowlandsCovenantSoulbind
                {
                    Id = soulbindData.Id,
                };
            }

            soulbind.Unlocked = soulbind.Unlocked || soulbindData.Unlocked;
            soulbind.Specializations = soulbindData.Specs.EmptyIfNull();

            var tree = soulbindData.Tree.EmptyIfNull();
            if (tree.Count > 0)
            {
                soulbind.Tree = tree;
            }
        }

        return soulbindMap.Values.ToList();
    }

    private async Task HandleGuildItems(PlayerGuild guild, UploadGuild guildData)
    {
        var itemMap = guild.Items
            .EmptyIfNull()
            .ToGroupedDictionary(pgi => (pgi.TabId, pgi.Slot));

        var itemIds = new HashSet<long>(
            guild.Items
                .EmptyIfNull()
                .Select(item => item.Id)
        );
        var seenIds = new HashSet<long>();

        // (tab, slot)
        foreach (var (tab, contents) in guildData.Items.EmptyIfNull())
        {
            short tabId = short.Parse(tab[1..]);
            foreach (var (slotString, itemString) in contents)
            {
                var slot = short.Parse(slotString[1..]);

                var parts = itemString.Split(":");
                if (parts.Length != 9 && parts.Length != 10 && !(parts.Length == 4 && parts[0] == "pet"))
                {
                    Logger.Warning("Invalid item string: {String}", itemString);
                    continue;
                }

                var key = (tabId, slot);
                PlayerGuildItem item;
                if (!itemMap.TryGetValue(key, out var items))
                {
                    item = new PlayerGuildItem
                    {
                        Guild = guild,
                        TabId = tabId,
                        Slot = slot,
                    };
                    Context.PlayerGuildItem.Add(item);
                }
                else
                {
                    item = items.FirstOrDefault(pci => pci.ItemId == int.Parse(parts[1])) ?? items.First();
                    seenIds.Add(item.Id);
                }

                AddItemDetails(item, parts);
            }
        }

        var deleteMe = itemIds
            .Except(seenIds)
            .ToArray();
        if (deleteMe.Length > 0)
        {
            await Context.PlayerGuildItem
                .Where(pgi => deleteMe.Contains(pgi.Id))
                .ExecuteDeleteAsync();
        }
    }

    private async Task HandleItems(PlayerCharacter character, UploadCharacter characterData)
    {
        characterData.ScanTimes.TryGetValue("bags", out int bagsTimestamp);
        characterData.ScanTimes.TryGetValue("bank", out int bankTimestamp);
        if (bagsTimestamp == 0 && bankTimestamp == 0)
        {
            Logger.Debug("Bags and bank not scanned");
            return;
        }

        var bagsScanned = bagsTimestamp.AsUtcDateTime();
        var bankScanned = bankTimestamp.AsUtcDateTime();
        bool updateBags = bagsScanned > character.AddonData.BagsScannedAt;
        bool updateBank = bankScanned > character.AddonData.BankScannedAt;

        if (!updateBags && !updateBank)
        {
            Logger.Debug("Bags and bank not scanned since last time");
            return;
        }

        List<int> bagIds = new();
        if (updateBags)
        {
            character.AddonData.BagsScannedAt = bagsScanned;
            bagIds.AddRange(PlayerBags);
        }
        if (updateBank)
        {
            character.AddonData.BankScannedAt = bankScanned;
            bagIds.AddRange(BankBags);
        }

        // Logger.Debug("bags={bags} bank={bank}", updateBags, updateBank);

        var itemMap = Context.PlayerCharacterItem
            .Where(pci => pci.CharacterId == character.Id)
            .Where(pci => bagIds.Contains(pci.BagId))
            .ToGroupedDictionary(item => (item.Location, item.BagId, item.Slot));

        var itemIds = new HashSet<long>(itemMap.Values
            .SelectMany(items => items.Select(item => item.Id)));
        var seenIds = new HashSet<long>();

        // Bags
        foreach ((string location, int itemId) in characterData.Bags.EmptyIfNull())
        {
            if (!location.StartsWith("b"))
            {
                Logger.Warning("Invalid bag location: {Location}", location);
                continue;
            }

            short bagId = short.Parse(location[1..]);
            if (!bagIds.Contains(bagId))
            {
                // Logger.Debug("Skipping bag {id}", bagId);
                continue;
            }
            var locationType = GetBagLocation(bagId);

            var key = (locationType, bagId, (short)0);
            PlayerCharacterItem item;
            if (!itemMap.TryGetValue(key, out var items))
            {
                item = new PlayerCharacterItem
                {
                    CharacterId = character.Id,
                    BagId = bagId,
                    Location = locationType,
                    Slot = 0,
                };
                Context.PlayerCharacterItem.Add(item);
            }
            else
            {
                item = items.FirstOrDefault(pci => pci.ItemId == itemId) ?? items.First();
                seenIds.Add(item.Id);
            }

            item.Count = 1;
            item.ItemId = itemId;
        }

        // Items
        foreach ((string location, var contents) in characterData.Items.EmptyIfNull())
        {
            if (!location.StartsWith("b"))
            {
                Logger.Warning("Invalid item location: {Location}", location);
                continue;
            }

            short bagId = short.Parse(location[1..]);
            if (!bagIds.Contains(bagId))
            {
                // Logger.Debug("Skipping item in bag {id}", bagId);
                continue;
            }
            var locationType = GetBagLocation(bagId);

            foreach ((string slotString, string itemString) in contents)
            {
                var slot = short.Parse(slotString[1..]);
                // count:id:context:enchant:ilvl:quality:suffix:bonusIDs:gems
                var parts = itemString.Split(":");
                if (parts.Length != 9 && parts.Length != 10 && !(parts.Length == 4 && parts[0] == "pet"))
                {
                    Logger.Warning("Invalid item string: {String}", itemString);
                    continue;
                }

                var key = (locationType, bagId, slot);
                PlayerCharacterItem item;
                if (!itemMap.TryGetValue(key, out var items))
                {
                    item = new PlayerCharacterItem
                    {
                        CharacterId = character.Id,
                        BagId = bagId,
                        Location = locationType,
                        Slot = slot,
                    };
                    Context.PlayerCharacterItem.Add(item);
                }
                else
                {
                    item = items.FirstOrDefault(pci => pci.ItemId == int.Parse(parts[1])) ?? items.First();
                    seenIds.Add(item.Id);
                }

                AddItemDetails(item, parts);
            }
        }

        var deleteMe = itemIds
            .Except(seenIds)
            .ToArray();
        if (deleteMe.Length > 0)
        {
            await Context.PlayerCharacterItem
                .Where(pci => deleteMe.Contains(pci.Id))
                .ExecuteDeleteAsync();
        }
    }

    private ItemLocation GetBagLocation(short bagId)
    {
        if (bagId is >= 0 and <= 5)
        {
            return ItemLocation.Bags;
        }

        if (bagId is -1 or (>= 6 and <= 12))
        {
            return ItemLocation.Bank;
        }

        if (bagId == -3)
        {
            return ItemLocation.ReagentBank;
        }

        return ItemLocation.Unknown;
    }

    private void AddItemDetails(IPlayerItem item, string[] parts)
    {
        if (parts[0] == "pet")
        {
            short.TryParse(parts[1], out short context);
            short.TryParse(parts[2], out short itemLevel);
            short.TryParse(parts[3], out short quality);

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
            short.TryParse(parts[2].OrDefault("0"), out short context);
            short.TryParse(parts[3].OrDefault("0"), out short enchantId);
            short.TryParse(parts[4].OrDefault("0"), out short itemLevel);
            short.TryParse(parts[5].OrDefault("0"), out short quality);
            short.TryParse(parts[6].OrDefault("0"), out short suffixId);

            // count:id:context:enchant:ilvl:quality:suffix:bonusIDs:gems
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
            }
        }
    }

    private static short GetCraftedQuality(string packedModifiers)
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

    private void HandleLockouts(PlayerCharacter character, UploadCharacter characterData)
    {
        // Basic sanity checks
        if (characterData.Lockouts == null || !characterData.ScanTimes.TryGetValue("lockouts", out int scanTimestamp))
        {
            return;
        }

        if (character.Lockouts == null)
        {
            character.Lockouts = new PlayerCharacterLockouts
            {
                Character = character,
            };
            Context.PlayerCharacterLockouts.Add(character.Lockouts);
        }

        var scanTime = scanTimestamp.AsUtcDateTime();
        if (scanTime <= character.Lockouts.LastUpdated)
        {
            return;
        }

        character.Lockouts.LastUpdated = scanTime;

        var newLockouts = new List<PlayerCharacterLockoutsLockout>();
        foreach (var lockoutData in characterData.Lockouts)
        {
            if (lockoutData.Id == 0)
            {
                if (!_instanceNameToIdMap.TryGetValue(lockoutData.Name, out int instanceId))
                {
                    Logger.Warning("Invalid lockout instance: {Name}", lockoutData.Name);
                    continue;
                }
                lockoutData.Id = instanceId;
            }

            var bosses = new List<PlayerCharacterLockoutsLockoutBoss>();
            foreach (var bossString in lockoutData.Bosses.EmptyIfNull())
            {
                var bossParts = bossString.Split(":");
                if (bossParts.Length != 2)
                {
                    Logger.Warning("Invalid lockout boss string: {String}", bossString);
                    continue;
                }

                bosses.Add(new PlayerCharacterLockoutsLockoutBoss
                {
                    Dead = bossParts[0] == "1",
                    Name = bossParts[1].Truncate(32),
                });
            }

            newLockouts.Add(new PlayerCharacterLockoutsLockout
            {
                Locked = lockoutData.Locked,
                DefeatedBosses = lockoutData.DefeatedBosses,
                Difficulty = lockoutData.Difficulty,
                Id = lockoutData.Id,
                MaxBosses = lockoutData.MaxBosses,
                Name = lockoutData.Name.Truncate(32),
                ResetTime = lockoutData.ResetTime.AsUtcDateTime(),
                Bosses = bosses,
            });
        }

        // Ensure a consistent order
        newLockouts = newLockouts
            .OrderBy(lockout => lockout.Id)
            .ThenBy(lockout => lockout.Difficulty)
            .ThenBy(lockout => lockout.ResetTime)
            .ToList();

        // If the lists are different lengths we know an update is required
        var update = newLockouts.Count != character.Lockouts.Lockouts?.Count;
        // Otherwise, compare the lists to see if the lockouts are the same
        if (!update)
        {
            for (int i = 0; i < newLockouts.Count; i++)
            {
                if (!character.Lockouts.Lockouts[i].Equals(newLockouts[i]))
                {
                    update = true;
                    break;
                }
            }
        }

        if (update)
        {
            character.Lockouts.Lockouts = newLockouts;
        }
    }

    private void HandleMounts(PlayerCharacter character, UploadCharacter characterData)
    {
        if (!characterData.ScanTimes.TryGetValue("mounts", out int scanTimestamp))
        {
            return;
        }
        var scanTime = scanTimestamp.AsUtcDateTime();

        if (character.AddonMounts == null)
        {
            character.AddonMounts = new PlayerCharacterAddonMounts
            {
                CharacterId = character.Id,
            };
            Context.PlayerCharacterAddonMounts.Add(character.AddonMounts);
        }

        if (scanTime > character.AddonMounts.ScannedAt)
        {
            character.AddonMounts.ScannedAt = scanTime;
            var sortedMountIds = characterData.Mounts
                .EmptyIfNull()
                .Order()
                .ToList();
            if (character.AddonMounts.Mounts == null || !sortedMountIds.SequenceEqual(character.AddonMounts.Mounts))
            {
                _resetMountCache = true;
                character.AddonMounts.Mounts = sortedMountIds;
            }
        }
    }

    private void HandleProfessionCooldowns(PlayerCharacter character, UploadCharacter characterData)
    {
        character.AddonData.ProfessionCooldowns = new();

        foreach (string cooldownString in characterData.ProfessionCooldowns.EmptyIfNull())
        {
            string[] cooldownParts = cooldownString.Split(':');
            character.AddonData.ProfessionCooldowns[cooldownParts[0]] = cooldownParts
                .Skip(1)
                .Select(int.Parse)
                .ToList();
        }

        foreach (string orderString in characterData.ProfessionOrders.EmptyIfNull())
        {
            // skill line, current, next
            string[] orderParts = orderString.Split(':');
            // next, current, max
            character.AddonData.ProfessionCooldowns[$"orders{orderParts[0]}"] = new()
            {
                int.Parse(orderParts[2]),
                int.Parse(orderParts[1]),
                4,
            };
        }
    }

    private void HandleProfessionTraits(PlayerCharacter character, UploadCharacter characterData)
    {
        character.AddonData.ProfessionTraits = new();

        foreach (string traitString in characterData.ProfessionTraits.EmptyIfNull())
        {
            string[] traitParts = traitString.Split('|');
            character.AddonData.ProfessionTraits[int.Parse(traitParts[0])] = traitParts
                .Skip(1)
                .Select(part => part
                    .Split(':')
                    .Select(int.Parse)
                    .ToArray()
                )
                .ToDictionary(pair => pair[0], pair => pair[1]);
        }
    }

    private void HandleQuests(PlayerCharacter character, UploadCharacter characterData, WowRegion region)
    {
        bool hasCallings = characterData.ScanTimes.TryGetValue("callings", out int callingsScanTimestamp);
        bool hasQuests = characterData.ScanTimes.TryGetValue("quests", out int questsScanTimestamp);
        bool hasWorldQuests = characterData.ScanTimes.TryGetValue("worldQuests", out int worldQuestsScanTimestamp);
        if (!hasCallings && !hasQuests && !hasWorldQuests)
        {
            return;
        }

        if (character.AddonQuests == null)
        {
            character.AddonQuests = new PlayerCharacterAddonQuests
            {
                CharacterId = character.Id,
            };
            Context.PlayerCharacterAddonQuests.Add(character.AddonQuests);
        }

        if (character.AddonQuests.Dailies == null)
        {
            character.AddonQuests.Dailies = new();
        }

        bool dailiesUpdated = false;
        if (callingsScanTimestamp > 0)
        {
            var scanTime = callingsScanTimestamp.AsUtcDateTime();
            if (scanTime >= character.AddonQuests.CallingsScannedAt)
            {
                character.AddonQuests.CallingsScannedAt = scanTime;

                // TODO fix hardcoded if next expansion also has these
                character.AddonQuests.Dailies[8] = new List<List<int>>
                {
                    characterData.Callings
                        .EmptyIfNull()
                        .Select(calling => calling.Completed ? 1 : 0)
                        .ToList(),
                    characterData.Callings
                        .EmptyIfNull()
                        .Select(calling => calling.Expires)
                        .ToList(),
                };

                // User is trusted, update global dailies
                if (characterData.Callings != null && _globalDailiesMap != null)
                {
                    var globalDailies = _globalDailiesMap[(region, 8)];
                    var questMap = new Dictionary<int, int>();
                    for (int i = 0; i < globalDailies.QuestIds.Count; i++)
                    {
                        questMap[globalDailies.QuestExpires[i]] = globalDailies.QuestIds[i];
                    }

                    foreach (var calling in characterData.Callings)
                    {
                        if (calling.QuestID > 0)
                        {
                            questMap[calling.Expires] = Hardcoded.CallingQuestLookup
                                .GetValueOrDefault(calling.QuestID, calling.QuestID);
                        }
                    }

                    var questPairs = Enumerable.TakeLast(questMap
                            .OrderBy(kvp => kvp.Key), 3)
                        .ToList();

                    globalDailies.QuestIds = questPairs
                        .Select(kvp => kvp.Value)
                        .ToList();
                    globalDailies.QuestExpires = questPairs
                        .Select(kvp => kvp.Key)
                        .ToList();
                }

                dailiesUpdated = true;
            }
        }

        if (questsScanTimestamp > 0)
        {
            var scanTime = questsScanTimestamp.AsUtcDateTime();
            if (scanTime >= character.AddonQuests.QuestsScannedAt)
            {
                character.AddonQuests.QuestsScannedAt = scanTime;

                character.AddonQuests.DailyQuests = characterData.DailyQuests.EmptyIfNull();
                character.AddonQuests.OtherQuests = characterData.OtherQuests.EmptyIfNull();

                character.AddonQuests.ProgressQuests = new();
                foreach (var packedProgress in characterData.ProgressQuests.EmptyIfNull())
                {
                    var progressParts = packedProgress.Split('|');
                    if (progressParts.Length < 5)
                    {
                        Logger.Warning("Invalid progress string: {progress}", packedProgress);
                        continue;
                    }

                    var progress = new PlayerCharacterAddonQuestsProgress
                    {
                        Id = int.Parse(progressParts[1]),
                        Name = progressParts[2],
                        Status = int.Parse(progressParts[3]),
                        Expires = int.Parse(progressParts[4]),
                    };

                    if (progressParts.Length == 6)
                    {
                        foreach (string packedObjective in progressParts[5].Split('_', StringSplitOptions.RemoveEmptyEntries))
                        {
                            string[] objectiveParts = packedObjective.Split(';');
                            if (objectiveParts.Length != 4)
                            {
                                Logger.Warning("Invalid objective string: {objective}", packedObjective);
                                continue;
                            }

                            progress.Objectives.Add(new()
                            {
                                Type = objectiveParts[0],
                                Text = objectiveParts[1],
                                Have = int.Parse(objectiveParts[2]),
                                Need = int.Parse(objectiveParts[3]),
                            });
                        }
                    }
                    else if (progressParts.Length > 6)
                    {
                        progress.Objectives.Add(new()
                        {
                            Have = int.Parse(progressParts[5]),
                            Need = int.Parse(progressParts[6]),
                            Type = progressParts[7],
                            Text = progressParts[8],
                        });
                    }

                    character.AddonQuests.ProgressQuests[progressParts[0]] = progress;
                }

                if (characterData.Emissaries != null)
                {
                    foreach (var (expansion, emissaries) in characterData.Emissaries)
                    {
                        character.AddonQuests.Dailies[expansion] = new List<List<int>>
                        {
                            emissaries
                                .Select(em => em.Completed ? 1 : 0)
                                .ToList(),
                            emissaries
                                .Select(em => em.Expires)
                                .ToList(),
                        };

                        // User is trusted, update global dailies from emissaries
                        if (_globalDailiesMap != null)
                        {
                            var globalDailies = _globalDailiesMap[(region, expansion)];

                            var questMap = new Dictionary<int, EmissaryData>();
                            for (int i = 0; i < globalDailies.QuestIds.Count; i++)
                            {
                                questMap[globalDailies.QuestExpires[i]] = new EmissaryData
                                {
                                    QuestId = globalDailies.QuestIds[i],
                                    OldReward = globalDailies.QuestRewards[i],
                                };
                            }

                            foreach (var emissary in emissaries)
                            {
                                if (emissary.QuestID > 0)
                                {
                                    if (questMap.TryGetValue(emissary.Expires, out var existing))
                                    {
                                        existing.QuestId = Hardcoded.CallingQuestLookup
                                            .GetValueOrDefault(emissary.QuestID, emissary.QuestID);
                                        existing.NewReward = emissary.Reward;
                                    }
                                    else
                                    {
                                        questMap[emissary.Expires] = new EmissaryData
                                        {
                                            QuestId = Hardcoded.CallingQuestLookup
                                                .GetValueOrDefault(emissary.QuestID, emissary.QuestID),
                                            NewReward = emissary.Reward,
                                        };
                                    }
                                }
                            }

                            var questPairs = questMap
                                .OrderBy(kvp => kvp.Key)
                                .TakeLast(3)
                                .ToList();

                            globalDailies.QuestExpires = questPairs
                                .Select(kvp => kvp.Key)
                                .ToList();

                            globalDailies.QuestIds = questPairs
                                .Select(kvp => kvp.Value.QuestId)
                                .ToList();

                            var rewards = new List<GlobalDailiesReward>();
                            foreach (var (_, emissaryData) in questPairs)
                            {
                                var gdReward = new GlobalDailiesReward
                                {
                                    CurrencyId = emissaryData.NewReward?.CurrencyID ?? 0,
                                    ItemId = emissaryData.NewReward?.ItemID ?? 0,
                                    Money = emissaryData.NewReward?.Money ?? 0,
                                    Quality = emissaryData.NewReward?.Quality ?? 0,
                                    Quantity = emissaryData.NewReward?.Quantity ?? 0,
                                };

                                if (emissaryData.OldReward == null ||
                                    gdReward.CurrencyId > emissaryData.OldReward.CurrencyId ||
                                    gdReward.ItemId > emissaryData.OldReward.ItemId ||
                                    gdReward.Money > emissaryData.OldReward.Money ||
                                    gdReward.Quality > emissaryData.OldReward.Quality ||
                                    gdReward.Quantity > emissaryData.OldReward.Quantity
                                )
                                {
                                    rewards.Add(gdReward);
                                }
                                else
                                {
                                    rewards.Add(emissaryData.OldReward);
                                }
                            }

                            globalDailies.QuestRewards = rewards;
                        }
                    }

                    dailiesUpdated = true;
                }

                _resetQuestCache = true;
            }
        }

        if (worldQuestsScanTimestamp > 0)
        {
            var scanTime = worldQuestsScanTimestamp.AsUtcDateTime();
            if (scanTime >= character.AddonQuests.WorldQuestsScannedAt)
            {
                character.AddonQuests.WorldQuestsScannedAt = scanTime;
                HandleQuestsWorld(character, characterData, region);
            }
        }

        if (dailiesUpdated)
        {
            Context.Entry(character.AddonQuests)
                .Property(caq => caq.Dailies)
                .IsModified = true;
        }
    }

    private void HandleQuestsWorld(PlayerCharacter character, UploadCharacter characterData, WowRegion region)
    {
        if (!_worldQuestReportMap.TryGetValue((short)region, out var reportMap))
        {
            _worldQuestReportMap[(short)region] = reportMap = new();
        }

        foreach ((short expansion, var zones) in characterData.WorldQuests.EmptyIfNull())
        {
            foreach ((int zoneId, string[] questStrings) in zones)
            {
                foreach (string questString in questStrings)
                {
                    var parts = questString.Split(':');
                    if (parts.Length != 5)
                    {
                        Logger.Warning("Invalid quest string: {s}", questString);
                        continue;
                    }

                    int questId = int.Parse(parts[0]);

                    var reportKey = (
                        expansion,
                        zoneId,
                        questId,
                        (short)character.Faction,
                        (short)character.ClassId
                    );
                    if (!reportMap.TryGetValue(reportKey, out var reportQuest))
                    {
                        reportMap[reportKey] = reportQuest = new WorldQuestReport()
                        {
                            UserId = _userId,
                            Region = (short)region,
                            Expansion = expansion,
                            ZoneId = zoneId,
                            QuestId = questId,
                            Faction = (short)character.Faction,
                            Class = (short)character.ClassId,
                            ReportedAt = DateTime.UtcNow,
                        };
                        Context.WorldQuestReport.Add(reportQuest);
                    }

                    reportQuest.ExpiresAt = int.Parse(parts[1]).AsUtcDateTime();
                    reportQuest.Location = $"{parts[2]} {parts[3]}";

                    // Fix wonky data, remove later
                    if (reportQuest.ReportedAt <= MiscConstants.DefaultDateTime)
                    {
                        reportQuest.ReportedAt = DateTime.UtcNow;
                    }

                    // type:id:amount
                    reportQuest.Rewards = new();
                    foreach (string rewardString in parts[4].Split('|'))
                    {
                        reportQuest.Rewards.Add(rewardString.Split('-').Select(int.Parse).ToArray());
                    }
                }
            }
        }
    }

    private void HandleReputations(PlayerCharacter character, UploadCharacter characterData)
    {
        if (character.Reputations == null)
        {
            return;
        }

        character.Reputations.ExtraReputationIds = new();
        character.Reputations.ExtraReputationValues = new();

        var reputations = characterData.Reputations
            .EmptyIfNull()
            .OrderBy(kvp => kvp.Key)
            .ToList();
        foreach (var (id, value) in reputations)
        {
            character.Reputations.ExtraReputationIds.Add(id);
            character.Reputations.ExtraReputationValues.Add(value);
        }

        character.Reputations.Paragons = new();
        foreach (var (paragonId, paragonString) in characterData.Paragons.EmptyIfNull())
        {
            var parts = paragonString.Split(":");
            if (parts.Length != 3)
            {
                Logger.Warning("Invalid item string: {String}", paragonString);
                continue;
            }

            var total = int.Parse(parts[0]);
            var max = int.Parse(parts[1]);
            var rewardAvailable = parts[2] == "1";

            character.Reputations.Paragons[paragonId] = new PlayerCharacterReputationsParagon
            {
                Current = total % max,
                Max = max,
                Received = total / max,
                RewardAvailable = rewardAvailable,
            };
        }
    }

    private void HandleTransmog(PlayerCharacter character, UploadCharacter characterData)
    {
        if (character.Transmog == null)
        {
            character.Transmog = new PlayerCharacterTransmog
            {
                Character = character,
            };
            Context.PlayerCharacterTransmog.Add(character.Transmog);
        }

        var illusions = characterData.Illusions
            .EmptyIfNullOrWhitespace()
            .Split(':', StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToList();
        if (illusions.Count > 0 && (character.Transmog.IllusionIds == null ||
                                    !illusions.SequenceEqual(character.Transmog.IllusionIds)))
        {
            character.Transmog.IllusionIds = illusions;
            _resetTransmogCache = true;
        }

        var transmog = characterData.Transmog
            .EmptyIfNullOrWhitespace()
            .Split(':', StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .Order()
            .ToList();
        if (transmog.Count > 0 && (character.Transmog.TransmogIds == null || !transmog.SequenceEqual(character.Transmog.TransmogIds)))
        {
            character.Transmog.TransmogIds = transmog;
            _resetTransmogCache = true;
        }
    }

    private void HandleWeekly(PlayerCharacter character, UploadCharacter characterData)
    {
        if (character.Weekly == null)
        {
            character.Weekly = new PlayerCharacterWeekly
            {
                Character = character,
            };
            Context.PlayerCharacterWeekly.Add(character.Weekly);
        }

        // Keystone
        if (characterData.ScanTimes.TryGetValue("bags", out int bagsScanned))
        {
            character.Weekly.KeystoneScannedAt = bagsScanned.AsUtcDateTime();
            character.Weekly.KeystoneDungeon = characterData.KeystoneInstance;
            character.Weekly.KeystoneLevel = characterData.KeystoneLevel;
        }

        // Vault
        if (characterData.ScanTimes.TryGetValue("vault", out int vaultScanned))
        {
            character.Weekly.Vault.ScannedAt = vaultScanned.AsUtcDateTime();

            character.Weekly.Vault.MythicPlusRuns = characterData.MythicDungeons
                .EmptyIfNull()
                .Select(d => new List<int> { d.Map, d.Level })
                .ToList();

            // https://wowpedia.fandom.com/wiki/API_C_WeeklyRewards.GetActivities
            if (characterData.Vault != null && characterData.Vault.Length == 3)
            {
                character.Weekly.Vault.MythicPlusProgress = ConvertVault(characterData.Vault[0]);
                character.Weekly.Vault.RankedPvpProgress = ConvertVault(characterData.Vault[1]);
                character.Weekly.Vault.RaidProgress = ConvertVault(characterData.Vault[2]);
            }
            else
            {
                character.Weekly.Vault.MythicPlusProgress = null;
                character.Weekly.Vault.RankedPvpProgress = null;
                character.Weekly.Vault.RaidProgress = null;
            }

            Context.Entry(character.Weekly).Property(e => e.Vault).IsModified = true;
        }
    }

    private static List<PlayerCharacterWeeklyVaultProgress> ConvertVault(UploadCharacterVault[] vault)
    {
        return vault
            .OrderBy(v => v.Threshold)
            .Select(v => new PlayerCharacterWeeklyVaultProgress
            {
                Level = v.Level,
                Progress = v.Progress,
                Threshold = v.Threshold,
            })
            .ToList();
    }

    public class EmissaryData
    {
        public int QuestId { get; set; }
        public UploadCharacterEmissaryReward NewReward { get; set; }
        public GlobalDailiesReward OldReward { get; set; }
    }
}
