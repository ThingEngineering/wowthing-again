using Serilog;
using Wowthing.Backend.Jobs.User;
using Wowthing.Backend.Models.Uploads;
using Wowthing.Lib.Comparers;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Helpers;

public class UserUploadCharacterProcessor
{
    private readonly UserUploadCharacterProcessorResult _result = new();
    private readonly ILogger _logger;
    private readonly WowDbContext _context;
    private readonly PlayerCharacter _character;
    private readonly UploadCharacter _characterData;
    private readonly WowRegion _region;
    private readonly Dictionary<string, int> _instanceNameToIdMap;

    private static readonly DictionaryComparer<int, PlayerCharacterAddonAchievementsAchievement> AchievementComparer =
        new(new PlayerCharacterAddonAchievementsAchievementComparer());

    private static readonly HashSet<string> FortifiedNames = new()
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

    private static readonly HashSet<int> PlayerBags = new()
    {
        0, // Backpack
        1, // Bag 1
        2, // Bag 2
        3, // Bag 3
        4, // Bag 4
        5, // Reagent bag
    };

    private static readonly HashSet<int> PlayerBankBags = new()
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

    public UserUploadCharacterProcessor(ILogger logger,
        WowDbContext context,
        Dictionary<string, int> instanceNameToIdMap,
        PlayerCharacter character,
        UploadCharacter characterData,
        WowRegion region)
    {
        _context = context;
        _instanceNameToIdMap = instanceNameToIdMap;
        _logger = logger;
        _character = character;
        _characterData = characterData;
        _region = region;
    }

    public async Task<UserUploadCharacterProcessorResult> Process(int? guildId)
    {
        var lastSeen = _characterData.LastSeen.AsUtcDateTime();
        _character.LastSeenAddon = lastSeen;

        if (lastSeen > _character.LastApiCheck)
        {
            _character.LastApiCheck = MiscConstants.DefaultDateTime;
            _character.ShouldUpdate = true;
        }

        _character.ChromieTime = _characterData.ChromieTime;
        _character.Copper = _characterData.Copper;
        _character.IsResting = _characterData.IsResting;
        _character.IsWarMode = _characterData.IsWarMode;
        _character.PlayedTotal = _characterData.PlayedTotal;
        _character.RestedExperience = _characterData.RestedXp;

        _character.GuildId = guildId;

        InitializeCharacterThings();

        HandleAddonData();

        HandleAchievements();
        HandleCovenants();

        await HandleItems();
        HandleLockouts();
        HandleMounts();
        //HandleMythicPlus();
        HandlePatronOrders();
        HandleProfessions();
        HandleProfessionCooldowns();
        HandleProfessionTraits();
        HandleQuests();
        HandleReputations();
        // HandleTransmog();
        HandleWeekly();

        return _result;
    }

    private void InitializeCharacterThings()
    {
        if (_character.AddonData == null)
        {
            _character.AddonData = new PlayerCharacterAddonData(_character.Id);
            _context.PlayerCharacterAddonData.Add(_character.AddonData);
        }

        if (_character.AddonAchievements == null)
        {
            _character.AddonAchievements = new PlayerCharacterAddonAchievements(_character.Id);
            _context.PlayerCharacterAddonAchievements.Add(_character.AddonAchievements);
        }

        if (_character.AddonMounts == null)
        {
            _character.AddonMounts = new PlayerCharacterAddonMounts(_character.Id);
            _context.PlayerCharacterAddonMounts.Add(_character.AddonMounts);
        }

        if (_character.AddonQuests == null)
        {
            _character.AddonQuests = new PlayerCharacterAddonQuests(_character.Id);
            _context.PlayerCharacterAddonQuests.Add(_character.AddonQuests);
        }

        if (_character.Lockouts == null)
        {
            _character.Lockouts = new PlayerCharacterLockouts(_character.Id);
            _context.PlayerCharacterLockouts.Add(_character.Lockouts);
        }

        if (_character.Shadowlands == null)
        {
            _character.Shadowlands = new PlayerCharacterShadowlands(_character.Id);
            _context.PlayerCharacterShadowlands.Add(_character.Shadowlands);
        }

        if (_character.Transmog == null)
        {
            _character.Transmog = new PlayerCharacterTransmog(_character.Id);
            _context.PlayerCharacterTransmog.Add(_character.Transmog);
        }

        if (_character.Weekly == null)
        {
            _character.Weekly = new PlayerCharacterWeekly(_character.Id);
            _context.PlayerCharacterWeekly.Add(_character.Weekly);
        }
    }

    private void HandleAddonData()
    {
        _character.AddonData.Level = _characterData.Level;
        _character.AddonData.LevelXp = _characterData.LevelXp;

        if (!string.IsNullOrWhiteSpace(_characterData.BindLocation))
        {
            _character.AddonData.BindLocation = _characterData.BindLocation.Truncate(64);
        }

        if (!string.IsNullOrWhiteSpace(_characterData.CurrentLocation))
        {
            _character.AddonData.CurrentLocation = _characterData.CurrentLocation.Truncate(64);
        }

        if (_characterData.DailyReset > 0)
        {
            _character.AddonData.DailyReset = _characterData.DailyReset.AsUtcDateTime();
        }

        if (_characterData.WeeklyReset > 0)
        {
            _character.AddonData.WeeklyReset = _characterData.WeeklyReset.AsUtcDateTime();
        }

        _character.AddonData.Auras = new();
        foreach (string auraString in _characterData.AurasV2.EmptyIfNull())
        {
            string[] auraParts = auraString.Split(':');
            if (auraParts.Length >= 2)
            {
                var aura = _character.AddonData.Auras[int.Parse(auraParts[0])] = new();
                aura.Expires = int.Parse(auraParts[1]);

                if (auraParts.Length >= 4)
                {
                    aura.Stacks = int.Parse(auraParts[2]);
                    aura.Duration = int.Parse(auraParts[3]);
                }
            }
        }

        // Currencies
        if (_characterData.Currencies != null &&
            _characterData.ScanTimes.TryGetValue("currencies", out int currenciesTimestamp))
        {
            var scanTime = currenciesTimestamp.AsUtcDateTime();
            if (scanTime > _character.AddonData.CurrenciesScannedAt)
            {
                _character.AddonData.Currencies = new();
                _character.AddonData.CurrenciesScannedAt = scanTime;

                foreach ((short currencyId, string currencyString) in _characterData.Currencies)
                {
                    // quantity:max:isWeekly:weekQuantity:weekMax:isMovingMax:totalQuantity
                    var parts = currencyString.Split(":");
                    if (parts.Length != 7)
                    {
                        _logger.Warning("Invalid currency string: {String}", currencyString);
                        continue;
                    }

                    if (!_character.AddonData.Currencies.TryGetValue(currencyId, out var currency))
                    {
                        _character.AddonData.Currencies[currencyId] = currency = new PlayerCharacterAddonDataCurrency
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
            }
        }

        // Equipment
        _character.AddonData.EquippedItems = new();
        foreach ((string slotString, string itemString) in _characterData.EquipmentV2.EmptyIfNull())
        {
            int slot = int.Parse(slotString[1..]);
            string[] parts = itemString.Split(":");
            if (parts.Length != 10 && parts.Length != 12)
            {
                _logger.Warning("Invalid equipped item string: {count} {string}", parts.Length, itemString);
                continue;
            }

            short.TryParse(parts[2].OrDefault("0"), out short context);
            short.TryParse(parts[3].OrDefault("0"), out short enchantId);
            short.TryParse(parts[4].OrDefault("0"), out short itemLevel);
            short.TryParse(parts[5].OrDefault("0"), out short quality);
            // short.TryParse(parts[6].OrDefault("0"), out short suffixId);

            var item = _character.AddonData.EquippedItems[slot] = new();

            // count:id:context:enchant:ilvl:quality:suffix:bonusIDs:gems:modifiers
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
                item.CraftedQuality = UserUploadJob.GetCraftedQuality(parts[9]);
            }
        }

        // Garrisons
        _character.AddonData.Garrisons ??= new();
        foreach (var dataGarrison in _characterData.Garrisons.EmptyIfNull())
        {
            var scanTime = dataGarrison.ScannedAt.AsUtcDateTime();
            if (!_character.AddonData.Garrisons.TryGetValue(dataGarrison.Type, out var dbGarrison))
            {
                dbGarrison = _character.AddonData.Garrisons[dataGarrison.Type] = new PlayerCharacterAddonDataGarrison
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
        if (_characterData.GarrisonTrees != null &&
            _characterData.ScanTimes.TryGetValue("garrisonTrees", out int garrisonTreesTimestamp))
        {
            var scanTime = garrisonTreesTimestamp.AsUtcDateTime();
            if (scanTime > _character.AddonData.GarrisonTreesScannedAt)
            {
                _character.AddonData.GarrisonTrees = new();
                _character.AddonData.GarrisonTreesScannedAt = scanTime;

                foreach (var (key, packedData) in _characterData.GarrisonTrees)
                {
                    if (!int.TryParse(key, out int treeId))
                    {
                        continue;
                    }

                    if (!_character.AddonData.GarrisonTrees.TryGetValue(treeId, out var tree))
                    {
                        tree = _character.AddonData.GarrisonTrees[treeId] = new Dictionary<int, List<int>>();
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

        // Highest item level
        _character.AddonData.HighestItemLevel ??= new();
        foreach (string slotItemLevel in _characterData.HighestItemLevel.EmptyIfNull())
        {
            string[] parts = slotItemLevel.Split(':');
            if (parts.Length != 2)
            {
                continue;
            }

            int slot = int.Parse(parts[0]);
            int itemLevel = int.Parse(parts[1]);
            _character.AddonData.HighestItemLevel[slot] = Math.Max(
                _character.AddonData.HighestItemLevel.GetValueOrDefault(slot),
                itemLevel
            );
        }

        // Mythic Plus
        if ((_characterData.MythicPlus != null || _characterData.MythicPlusV2 != null) &&
            _characterData.ScanTimes.TryGetValue("mythicPlus", out int mythicPlusTimestamp))
        {
            var scanTime = mythicPlusTimestamp.AsUtcDateTime();
            if (scanTime > _character.AddonData.MythicPlusScannedAt)
            {
                _character.AddonData.MythicPlusScannedAt = scanTime;

                // V1 data
                if (_characterData.MythicPlus != null)
                {
                    if (_character.AddonData.MythicPlus == null)
                    {
                        _character.AddonData.MythicPlus = new();
                    }

                    var season = _character.AddonData.MythicPlus[_characterData.MythicPlus.Season] = new();

                    foreach (var map in _characterData.MythicPlus.Maps.EmptyIfNull())
                    {
                        var mapData = season.Maps[map.MapId] = new PlayerCharacterAddonDataMythicPlusMap();
                        mapData.OverallScore = map.OverallScore;

                        foreach (var mapScore in map.AffixScores.EmptyIfNull())
                        {
                            if (FortifiedNames.Contains(mapScore.Name))
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

                    foreach (var runString in _characterData.MythicPlus.Runs.EmptyIfNull())
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
                if (_characterData.MythicPlusV2 != null)
                {
                    // Seasons
                    if (_character.AddonData.MythicPlusSeasons == null)
                    {
                        _character.AddonData.MythicPlusSeasons = new();
                    }

                    foreach (var (seasonId, maps) in _characterData.MythicPlusV2.Seasons.EmptyIfNull())
                    {
                        var season = _character.AddonData.MythicPlusSeasons[seasonId] = new();

                        foreach (var map in maps)
                        {
                            var mapData = season[map.MapId] = new PlayerCharacterAddonDataMythicPlusMap();
                            mapData.OverallScore = map.OverallScore;

                            foreach (var mapScore in map.AffixScores.EmptyIfNull())
                            {
                                if (FortifiedNames.Contains(mapScore.Name))
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
                    foreach (var (season, data) in _character.AddonData.MythicPlus.EmptyIfNull())
                    {
                        if (!_character.AddonData.MythicPlusSeasons.ContainsKey(season))
                        {
                            _character.AddonData.MythicPlusSeasons[season] = data.Maps;
                        }
                    }

                    // Weeks
                    _character.AddonData.MythicPlusWeeks ??= new();

                    foreach (var (weekEnds, runStrings) in _characterData.MythicPlusV2.Weeks.EmptyIfNull())
                    {
                        var week = _character.AddonData.MythicPlusWeeks[weekEnds] = new();
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
        var entry = _context.Entry(_character.AddonData);
        entry.Property(ad => ad.Garrisons).IsModified = true;
        entry.Property(ad => ad.MythicPlusSeasons).IsModified = true;
        entry.Property(ad => ad.MythicPlusWeeks).IsModified = true;
    }

    private void HandleAchievements()
    {
        // Basic sanity checks
        if (_characterData.Achievements == null || !_characterData.ScanTimes.TryGetValue("achievements", out int scanTimestamp))
        {
            return;
        }

        var scanTime = scanTimestamp.AsUtcDateTime();
        if (scanTime <= _character.AddonAchievements.ScannedAt)
        {
            return;
        }

        var newAchievements = _characterData.Achievements
            .EmptyIfNull()
            .ToDictionary(
                ach => ach.Id,
                ach => new PlayerCharacterAddonAchievementsAchievement
                {
                    Earned = ach.Earned,
                    Criteria = ach.Criteria,
                }
            );

        if (!AchievementComparer.Equals(_character.AddonAchievements.Achievements.EmptyIfNull(), newAchievements))
        {
            _character.AddonAchievements.ScannedAt = scanTime;
            _character.AddonAchievements.Achievements = _characterData.Achievements
                .ToDictionary(
                    ach => ach.Id,
                    ach => new PlayerCharacterAddonAchievementsAchievement
                    {
                        Earned = ach.Earned,
                        Criteria = ach.Criteria,
                    }
                );

            _result.ResetAchievementCache = true;
        }
    }

    private void HandleCovenants()
    {
        if (_characterData.ActiveCovenantId > 0)
        {
            _character.Shadowlands.CovenantId = _characterData.ActiveCovenantId;
        }

        _character.Shadowlands.Covenants ??= new();

        foreach (var covenantData in _characterData.Covenants.EmptyIfNull())
        {
            if (!_character.Shadowlands.Covenants.TryGetValue(covenantData.Id, out var covenant))
            {
                covenant = _character.Shadowlands.Covenants[covenantData.Id] = new PlayerCharacterShadowlandsCovenant();
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
        var entry = _context.Entry(_character.Shadowlands);
        entry.Property(cs => cs.Covenants).IsModified = true;
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

    private async Task HandleItems()
    {
        _characterData.ScanTimes.TryGetValue("bags", out int bagsTimestamp);
        _characterData.ScanTimes.TryGetValue("bank", out int bankTimestamp);
        if (bagsTimestamp == 0 && bankTimestamp == 0)
        {
            _logger.Debug("Bags and bank not scanned");
            return;
        }

        var bagsScanned = bagsTimestamp.AsUtcDateTime();
        var bankScanned = bankTimestamp.AsUtcDateTime();
        bool updateBags = bagsScanned > _character.AddonData.BagsScannedAt;
        bool updateBank = bankScanned > _character.AddonData.BankScannedAt;

        if (!updateBags && !updateBank)
        {
            _logger.Debug("Bags and bank not scanned since last time");
            return;
        }

        List<int> bagIds = new();
        if (updateBags)
        {
            _character.AddonData.BagsScannedAt = bagsScanned;
            bagIds.AddRange(PlayerBags);
        }
        if (updateBank)
        {
            _character.AddonData.BankScannedAt = bankScanned;
            bagIds.AddRange(PlayerBankBags);
        }

        // Logger.Debug("bags={bags} bank={bank}", updateBags, updateBank);

        var characterItems = await _context.PlayerCharacterItem
            .Where(pci => pci.CharacterId == _character.Id)
            .Where(pci => bagIds.Contains(pci.ContainerId))
            .ToArrayAsync();
        var itemMap = characterItems.ToGroupedDictionary(item => (item.Location, item.ContainerId, item.Slot));

        var itemIds = new HashSet<long>(characterItems.Select(item => item.Id));
        var seenIds = new HashSet<long>();

        // Bags
        foreach ((string location, int itemId) in _characterData.Bags.EmptyIfNull())
        {
            if (!location.StartsWith('b'))
            {
                _logger.Warning("Invalid bag location: {Location}", location);
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
                    CharacterId = _character.Id,
                    ContainerId = bagId,
                    Location = locationType,
                    Slot = 0,
                };
                _context.PlayerCharacterItem.Add(item);
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
        foreach ((string location, var contents) in _characterData.Items.EmptyIfNull())
        {
            if (!location.StartsWith("b"))
            {
                _logger.Warning("Invalid item location: {Location}", location);
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
                if (itemString == "pet")
                {
                    continue;
                }

                // count:id:context:enchant:ilvl:quality:suffix:bonusIDs:gems
                string[] parts = itemString.Split(":");
                if (parts.Length != 10 && parts.Length != 12 && !(parts.Length == 4 && parts[0] == "pet"))
                {
                    _logger.Warning("Invalid bags item string: {count} {string}", parts.Length, itemString);
                    continue;
                }

                short slot = short.Parse(slotString[1..]);
                var key = (locationType, bagId, slot);

                PlayerCharacterItem item;
                if (!itemMap.TryGetValue(key, out var items))
                {
                    item = new PlayerCharacterItem
                    {
                        CharacterId = _character.Id,
                        ContainerId = bagId,
                        Location = locationType,
                        Slot = slot,
                    };
                    itemMap[key] = [item];
                    _context.PlayerCharacterItem.Add(item);
                }
                else
                {
                    item = items.FirstOrDefault(pci => pci.ItemId == int.Parse(parts[1])) ?? items.First();
                    seenIds.Add(item.Id);
                }

                UserUploadJob.AddItemDetails(item, parts);
            }
        }

        var deleteMe = itemIds
            .Except(seenIds)
            .ToArray();
        if (deleteMe.Length > 0)
        {
            await _context.PlayerCharacterItem
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

    private void HandleLockouts()
    {
        // Basic sanity checks
        if (_characterData.Lockouts == null || !_characterData.ScanTimes.TryGetValue("lockouts", out int scanTimestamp))
        {
            return;
        }

        var scanTime = scanTimestamp.AsUtcDateTime();
        if (scanTime <= _character.Lockouts.LastUpdated)
        {
            return;
        }

        _character.Lockouts.LastUpdated = scanTime;

        var newLockouts = new List<PlayerCharacterLockoutsLockout>();
        foreach (var lockoutData in _characterData.Lockouts)
        {
            if (lockoutData.Id == 0)
            {
                if (!_instanceNameToIdMap.TryGetValue(lockoutData.Name, out int instanceId))
                {
                    _logger.Warning("Invalid lockout instance: {Name}", lockoutData.Name);
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
                    _logger.Warning("Invalid lockout boss string: {String}", bossString);
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
        var update = newLockouts.Count != _character.Lockouts.Lockouts?.Count;
        // Otherwise, compare the lists to see if the lockouts are the same
        if (!update)
        {
            for (int i = 0; i < newLockouts.Count; i++)
            {
                if (!_character.Lockouts.Lockouts[i].Equals(newLockouts[i]))
                {
                    update = true;
                    break;
                }
            }
        }

        if (update)
        {
            _character.Lockouts.Lockouts = newLockouts;
        }
    }

    private void HandleMounts()
    {
        if (!_characterData.ScanTimes.TryGetValue("mounts", out int scanTimestamp))
        {
            return;
        }
        var scanTime = scanTimestamp.AsUtcDateTime();

        if (scanTime > _character.AddonMounts.ScannedAt)
        {
            _character.AddonMounts.ScannedAt = scanTime;
            var sortedMountIds = _characterData.Mounts
                .EmptyIfNull()
                .Order()
                .ToList();
            if (_character.AddonMounts.Mounts == null || !sortedMountIds.SequenceEqual(_character.AddonMounts.Mounts))
            {
                _result.ResetMountCache = true;
                _character.AddonMounts.Mounts = sortedMountIds;
            }
        }
    }

    private void HandlePatronOrders()
    {
        if (_characterData.PatronOrders == null ||
            !_characterData.ScanTimes.TryGetValue("patronOrders", out int scanTimestamp))
        {
            return;
        }

        var scanTime = scanTimestamp.AsUtcDateTime();
        if (scanTime <= _character.AddonData.PatronOrdersScannedAt)
        {
            return;
        }

        _character.AddonData.PatronOrders ??= new();
        _character.AddonData.PatronOrdersScannedAt = scanTime;

        foreach ((int professionId, string[] patronOrderStrings) in _characterData.PatronOrders)
        {
            var patronOrders = _character.AddonData.PatronOrders[professionId] = new();
            foreach (string patronOrderString in patronOrderStrings)
            {
                // expires, abilityId, itemId, minQuality, tipAmount, rewards, reagents
                // 1726930800|49722|213501|3|615326|1:227713:11:0:0:0:0:::_1:228735:0:0:0:0:0:::|300:210814
                string[] orderParts = patronOrderString.Split("|");
                if (orderParts.Length != 7)
                {
                    _logger.Warning("Invalid patron order string: {s}", patronOrderString);
                    continue;
                }

                var patronOrder = new PlayerCharacterAddonDataPatronOrder
                {
                    ExpirationTime = int.Parse(orderParts[0]),
                    SkillLineAbilityId = int.Parse(orderParts[1]),
                    ItemId = int.Parse(orderParts[2]),
                    MinQuality = int.Parse(orderParts[3]),
                    TipAmount = int.Parse(orderParts[4]),
                    Rewards = orderParts[5]
                        .Split('_')
                        .Where(s => !s.IsNullOrEmpty())
                        .Select(reward => reward.Split(':'))
                        .Select(rewardParts => new PlayerCharacterAddonDataPatronOrderReward
                        {
                            Count = int.Parse(rewardParts[0]),
                            ItemId = int.Parse(rewardParts[1])
                        })
                        .ToList(),
                    Reagents = orderParts[6]
                        .Split('_')
                        .Where(s => !s.IsNullOrEmpty())
                        .Select(reward => reward.Split(':'))
                        .Select(rewardParts => new PlayerCharacterAddonDataPatronOrderReagent
                        {
                            Count = int.Parse(rewardParts[0]),
                            ItemId = int.Parse(rewardParts[1])
                        })
                        .ToList(),
                };

                patronOrders.Add(patronOrder);
            }
        }

        // Change detection for this is obnoxious, just update it
        var entry = _context.Entry(_character.AddonData);
        entry.Property(ad => ad.PatronOrders).IsModified = true;
    }

    private void HandleProfessions()
    {
        _character.AddonData.Professions = new();

        foreach (var profession in _characterData.Professions.EmptyIfNull())
        {
            _character.AddonData.Professions[profession.Id] = new PlayerCharacterProfessionTier()
            {
                CurrentSkill = profession.CurrentSkill,
                MaxSkill = profession.MaxSkill,
                KnownRecipes = profession.KnownRecipes,
            };
        }
    }

    private void HandleProfessionCooldowns()
    {
        _character.AddonData.ProfessionCooldowns = new();

        foreach (string cooldownString in _characterData.ProfessionCooldowns.EmptyIfNull())
        {
            string[] cooldownParts = cooldownString.Split(':');
            _character.AddonData.ProfessionCooldowns[cooldownParts[0]] = cooldownParts
                .Skip(1)
                .Select(int.Parse)
                .ToList();
        }

        foreach (string orderString in _characterData.ProfessionOrders.EmptyIfNull())
        {
            // skill line, current, next
            string[] orderParts = orderString.Split(':');
            // next, current, max
            _character.AddonData.ProfessionCooldowns[$"orders{orderParts[0]}"] = new()
            {
                int.Parse(orderParts[2]),
                int.Parse(orderParts[1]),
                4,
            };
        }
    }

    private void HandleProfessionTraits()
    {
        _character.AddonData.ProfessionTraits = new();

        foreach (string traitString in _characterData.ProfessionTraits.EmptyIfNull())
        {
            string[] traitParts = traitString.Split('|');
            _character.AddonData.ProfessionTraits[int.Parse(traitParts[0])] = traitParts
                .Skip(1)
                .Select(part => part
                    .Split(':')
                    .Select(int.Parse)
                    .ToArray()
                )
                .ToDictionary(pair => pair[0], pair => pair[1]);
        }
    }

    private void HandleQuests()
    {
        bool hasCallings = _characterData.ScanTimes.TryGetValue("callings", out int callingsScanTimestamp);
        bool hasCompleted = _characterData.ScanTimes.TryGetValue("completedQuests", out int completedScanTimestamp);
        bool hasQuests = _characterData.ScanTimes.TryGetValue("quests", out int questsScanTimestamp);
        bool hasWorldQuests = _characterData.ScanTimes.TryGetValue("worldQuests", out int worldQuestsScanTimestamp);
        if (!hasCallings && !hasCompleted && !hasQuests && !hasWorldQuests)
        {
            return;
        }

        _character.AddonQuests.CompletedQuests ??= new();
        _character.AddonQuests.Dailies ??= new();

        // bool dailiesUpdated = false;
        // if (callingsScanTimestamp > 0)
        // {
        //     var scanTime = callingsScanTimestamp.AsUtcDateTime();
        //     if (scanTime >= _character.AddonQuests.CallingsScannedAt)
        //     {
        //         _character.AddonQuests.CallingsScannedAt = scanTime;
        //
        //         // TODO fix hardcoded if next expansion also has these
        //         _character.AddonQuests.Dailies[8] = new List<List<int>>
        //         {
        //             _characterData.Callings
        //                 .EmptyIfNull()
        //                 .Select(calling => calling.Completed ? 1 : 0)
        //                 .ToList(),
        //             _characterData.Callings
        //                 .EmptyIfNull()
        //                 .Select(calling => calling.Expires)
        //                 .ToList(),
        //         };
        //
        //         // User is trusted, update global dailies
        //         if (_characterData.Callings != null && _globalDailiesMap != null)
        //         {
        //             var globalDailies = _globalDailiesMap[(_region, 8)];
        //             var questMap = new Dictionary<int, int>();
        //             for (int i = 0; i < globalDailies.QuestIds.Count; i++)
        //             {
        //                 questMap[globalDailies.QuestExpires[i]] = globalDailies.QuestIds[i];
        //             }
        //
        //             foreach (var calling in _characterData.Callings)
        //             {
        //                 if (calling.QuestID > 0)
        //                 {
        //                     questMap[calling.Expires] = Hardcoded.CallingQuestLookup
        //                         .GetValueOrDefault(calling.QuestID, calling.QuestID);
        //                 }
        //             }
        //
        //             var questPairs = Enumerable.TakeLast(questMap
        //                     .OrderBy(kvp => kvp.Key), 3)
        //                 .ToList();
        //
        //             globalDailies.QuestIds = questPairs
        //                 .Select(kvp => kvp.Value)
        //                 .ToList();
        //             globalDailies.QuestExpires = questPairs
        //                 .Select(kvp => kvp.Key)
        //                 .ToList();
        //         }
        //
        //         dailiesUpdated = true;
        //     }
        // }

        if (completedScanTimestamp > 0)
        {
            _result.ResetQuestCache = true;

            var scanTime = completedScanTimestamp.AsUtcDateTime();
            if (scanTime >= _character.AddonQuests.CompletedQuestsScannedAt)
            {
                _character.AddonQuests.CompletedQuestsScannedAt = scanTime;
                _character.AddonQuests.CompletedQuests = SquishUtilities.Unsquish(_characterData.CompletedQuestsSquish);
            }
        }

        if (questsScanTimestamp > 0)
        {
            _result.ResetQuestCache = true;

            var scanTime = questsScanTimestamp.AsUtcDateTime();
            if (scanTime >= _character.AddonQuests.QuestsScannedAt)
            {
                _character.AddonQuests.QuestsScannedAt = scanTime;

                _character.AddonQuests.DailyQuests = _characterData.DailyQuests.EmptyIfNull();
                _character.AddonQuests.OtherQuests = _characterData.OtherQuests.EmptyIfNull();

                _character.AddonQuests.ProgressQuests = new();
                foreach (string packedProgress in _characterData.ProgressQuests.EmptyIfNull())
                {
                    string[] progressParts = packedProgress.Split('|', 6);
                    if (progressParts.Length != 6)
                    {
                        _logger.Warning("Invalid progress string: {progress}", packedProgress);
                        continue;
                    }

                    var progress = new PlayerCharacterAddonQuestsProgress
                    {
                        Id = int.Parse(progressParts[1]),
                        Name = progressParts[2],
                        Status = int.Parse(progressParts[3]),
                        Expires = int.Parse(progressParts[4]),
                    };

                    foreach (string packedObjective in progressParts[5].Split('_', StringSplitOptions.RemoveEmptyEntries))
                    {
                        string[] objectiveParts = packedObjective.Split(';');
                        if (objectiveParts.Length != 4)
                        {
                            _logger.Warning("Invalid objective string: {objective}", packedObjective);
                            continue;
                        }

                        progress.Objectives.Add(new()
                        {
                            Type = objectiveParts[0],
                            Text = objectiveParts[1],
                            Have = (int)Math.Round(double.Parse(objectiveParts[2])),
                            Need = int.Parse(objectiveParts[3]),
                        });
                    }

                    _character.AddonQuests.ProgressQuests[progressParts[0]] = progress;
                }

                // Hacky workaround to make these into progress quests
                foreach (var instanceDone in _characterData.InstanceDone.EmptyIfNull())
                {
                    _character.AddonQuests.ProgressQuests[instanceDone.Key] = new PlayerCharacterAddonQuestsProgress
                    {
                        Id = 0,
                        Name = "Hack",
                        Status = instanceDone.Locked ? 2 : 0,
                        Expires = instanceDone.ResetTime,
                    };
                }
            }
        }

        if (worldQuestsScanTimestamp > 0)
        {
            var scanTime = worldQuestsScanTimestamp.AsUtcDateTime();
            if (scanTime >= _character.AddonQuests.WorldQuestsScannedAt)
            {
                _character.AddonQuests.WorldQuestsScannedAt = scanTime;
                HandleQuestsWorld();
            }
        }

        // if (dailiesUpdated)
        // {
        //     var entry = _context.Entry(_character.AddonQuests);
        //     entry.Property(caq => caq.Dailies).IsModified = true;
        // }
    }

    private void HandleQuestsWorld()
    {
        // short shortRegion = (short)_region;
        // if (!_worldQuestReportMap.TryGetValue(shortRegion, out var reportMap))
        // {
        //     _worldQuestReportMap[shortRegion] = reportMap = new();
        // }
        //
        foreach ((short expansion, var zones) in _characterData.WorldQuests.EmptyIfNull())
        {
            foreach ((int zoneId, string[] questStrings) in zones)
            {
                foreach (string questString in questStrings)
                {
                    string[] parts = questString.Split(':');
                    if (parts.Length != 5)
                    {
                        _logger.Warning("Invalid quest string: {s}", questString);
                        continue;
                    }

                    int questId = int.Parse(parts[0]);
                    short shortFaction = (short)_character.Faction;
                    short shortClass = (short)_character.ClassId;

                    var reportKey = new WorldQuestReportKey(
                        expansion,
                        zoneId,
                        questId,
                        shortFaction,
                        shortClass
                    );
                    if (_result.WorldQuestReports.ContainsKey(reportKey))
                    {
                        continue;
                    }

                    var reportQuest = new WorldQuestReport
                    {
                        UserId = 0,
                        Region = (short)_region,
                        Expansion = expansion,
                        ZoneId = zoneId,
                        QuestId = questId,
                        Faction = shortFaction,
                        Class = shortClass,
                        ReportedAt = DateTime.UtcNow,
                        ExpiresAt = int.Parse(parts[1]).AsUtcDateTime(),
                        Location = $"{parts[2]} {parts[3]}",
                    };

                    // type:id:amount
                    foreach (string rewardString in parts[4].Split('|'))
                    {
                        reportQuest.Rewards.Add(rewardString.Split('-').Select(int.Parse).ToArray());
                    }

                    _result.WorldQuestReports.Add(reportKey, reportQuest);
                }
            }
        }
    }

    private void HandleReputations()
    {
        if (_character.Reputations == null)
        {
            return;
        }

        _character.Reputations.ExtraReputationIds = new();
        _character.Reputations.ExtraReputationValues = new();

        var reputations = _characterData.Reputations
            .EmptyIfNull()
            .OrderBy(kvp => kvp.Key)
            .ToList();
        foreach (var (id, value) in reputations)
        {
            _character.Reputations.ExtraReputationIds.Add(id);
            _character.Reputations.ExtraReputationValues.Add(value);
        }

        _character.Reputations.Paragons = new();
        foreach (var (paragonId, paragonString) in _characterData.Paragons.EmptyIfNull())
        {
            var parts = paragonString.Split(":");
            if (parts.Length != 3)
            {
                _logger.Warning("Invalid paragon string: {String}", paragonString);
                continue;
            }

            var total = int.Parse(parts[0]);
            var max = int.Parse(parts[1]);
            var rewardAvailable = parts[2] == "1";

            _character.Reputations.Paragons[paragonId] = new PlayerCharacterReputationsParagon
            {
                Current = total % max,
                Max = max,
                Received = total / max,
                RewardAvailable = rewardAvailable,
            };
        }
    }

    private void HandleTransmog()
    {
        List<int> transmog;
        if (_characterData.TransmogSquish != null)
        {
            transmog = SquishUtilities.Unsquish(_characterData.TransmogSquish);
        }
        else
        {
            transmog = _characterData.Transmog
                .EmptyIfNullOrWhitespace()
                .Split(':', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .Order()
                .ToList();
        }

        if (transmog.Count > 0 && (_character.Transmog.TransmogIds == null ||
                                   !transmog.SequenceEqual(_character.Transmog.TransmogIds)))
        {
            _character.Transmog.TransmogIds = transmog;
            _result.ResetTransmogCache = true;
        }
    }

    private void HandleWeekly()
    {
        // Delves
        _character.Weekly.DelveGilded = _characterData.DelvesGilded;

        if (_characterData.Delves != null)
        {
            int maxKey = _characterData.Delves.Keys.Max();
            if (maxKey > 0)
            {
                string[] delveStrings = _characterData.Delves[maxKey].Where(s => s != "0").ToArray();
                if (delveStrings.Length > 0)
                {
                    _character.Weekly.DelveWeek = maxKey;
                    _character.Weekly.DelveLevels = [];
                    _character.Weekly.DelveMaps = [];
                    foreach (string delveString in delveStrings)
                    {
                        string[] parts = delveString.Split('|');
                        _character.Weekly.DelveMaps.Add(parts[1]);
                        _character.Weekly.DelveLevels.Add(int.Parse(parts[2]));
                    }
                }
            }
        }

        // Keystone
        if (_characterData.ScanTimes.TryGetValue("bags", out int bagsScanned))
        {
            _character.Weekly.KeystoneScannedAt = bagsScanned.AsUtcDateTime();
            _character.Weekly.KeystoneDungeon = _characterData.KeystoneInstance;
            _character.Weekly.KeystoneLevel = _characterData.KeystoneLevel;
        }

        // Vault
        if (_characterData.ScanTimes.TryGetValue("vault", out int vaultScanned))
        {
            _character.Weekly.Vault ??= new();

            _character.Weekly.Vault.ScannedAt = vaultScanned.AsUtcDateTime();
            _character.Weekly.Vault.AvailableRewards = _characterData.VaultAvailableRewards;
            _character.Weekly.Vault.GeneratedRewards = _characterData.VaultGeneratedRewards;
            _character.Weekly.Vault.HasRewards = _characterData.VaultHasRewards;

            _character.Weekly.Vault.MythicPlusRuns = _characterData.MythicDungeons
                .EmptyIfNull()
                .Select(d => new List<int> { d.Map, d.Level })
                .ToList();

            // https://wowpedia.fandom.com/wiki/API_C_WeeklyRewards.GetActivities
            _character.Weekly.Vault.MythicPlusProgress = null;
            _character.Weekly.Vault.RaidProgress = null;
            _character.Weekly.Vault.WorldProgress = null;

            if (_characterData.Vault != null)
            {
                if (_characterData.Vault.TryGetValue("t1", out var activityVault))
                {
                    _character.Weekly.Vault.MythicPlusProgress = ConvertVault(activityVault);
                }

                if (_characterData.Vault.TryGetValue("t3", out var raidVault))
                {
                    _character.Weekly.Vault.RaidProgress = ConvertVault(raidVault);
                }

                if (_characterData.Vault.TryGetValue("t6", out var worldVault))
                {
                    _character.Weekly.Vault.WorldProgress = ConvertVault(worldVault);
                }
            }

            var entry = _context.Entry(_character.Weekly);
            entry.Property(e => e.Vault).IsModified = true;
        }
    }

    private static List<PlayerCharacterWeeklyVaultProgress> ConvertVault(UploadCharacterVault[] tiers)
    {
        var ret = new List<PlayerCharacterWeeklyVaultProgress>();

        foreach (var tier in tiers.OrderBy(tier => tier.Threshold))
        {
            var progress = new PlayerCharacterWeeklyVaultProgress
            {
                Level = tier.Level,
                Progress = tier.Progress,
                Threshold = tier.Threshold,
                Tier = tier.Tier,
            };

            foreach (string itemString in tier.Rewards.EmptyIfNull())
            {
                string[] parts = itemString.Split(':');
                var item = new PlayerCharacterItem();
                UserUploadJob.AddItemDetails(item, parts);
                progress.Rewards.Add(item);
            }

            ret.Add(progress);
        }

        return ret;
    }

}

public record struct WorldQuestReportKey(short Expansion, int ZoneId, int QuestId, short Faction, short Class);

public class UserUploadCharacterProcessorResult
{
    public bool ResetAchievementCache;
    public bool ResetMountCache;
    public bool ResetQuestCache;
    public bool ResetTransmogCache;

    public Dictionary<WorldQuestReportKey, WorldQuestReport> WorldQuestReports { get; set; } = new();
}
