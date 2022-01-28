using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoreLinq;
using MoreLinq.Extensions;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Uploads;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User
{
    public class UserUploadJob : JobBase
    {
        private JankTimer _timer;
        private Dictionary<(WowRegion Region, string Name), WowRealm> _realmMap;

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            long userId = long.Parse(data[0]);
            using var shrug = UserLog(userId);

            Logger.Information("Processing upload...");

            var json = LuaToJsonConverter.Convert(data[1].Replace("WWTCSaved = ", ""));
            _timer.AddPoint("Convert");

#if DEBUG
            await File.WriteAllTextAsync(Path.Join("..", "..", "lua.json"), json);
            _timer.AddPoint("Write");
#endif
            
            var parsed = JsonConvert.DeserializeObject<Upload[]>(json)[0]; // TODO work out why this is an array of objects
            _timer.AddPoint("Parse");
            
            // Fetch guild data
            var guildMap = await Context.PlayerGuild
                .Where(pg => pg.UserId == userId)
                .Include(pg => pg.Items)
                .ToDictionaryAsync(pg => (pg.RealmId, pg.Name));
            
            // Fetch character data
            var characterMap = await Context.PlayerCharacter
                .Where(c => c.Account.UserId == userId)
                .Include(c => c.AddonAchievements)
                .Include(c => c.AddonMounts)
                .Include(c => c.AddonQuests)
                .Include(c => c.Currencies)
                .Include(c => c.Items)
                .Include(c => c.Lockouts)
                .Include(c => c.MythicPlusAddon)
                .Include(c => c.Reputations)
                .Include(c => c.Shadowlands)
                .Include(c => c.Transmog)
                .Include(c => c.Weekly)
                .AsSplitQuery()
                .ToDictionaryAsync(k => (k.RealmId, k.Name));

            var realmIds = characterMap.Values
                .Select(c => c.RealmId)
                .Distinct()
                .ToArray();

            var connectedRealmId = Context.WowRealm
                .AsNoTracking()
                .Where(r => realmIds.Contains(r.Id))
                .Select(r => r.ConnectedRealmId);
            
            _realmMap = await Context.WowRealm
                .AsNoTracking()
                .Where(r => connectedRealmId.Contains(r.ConnectedRealmId))
                .ToDictionaryAsync(k => (k.Region, k.Name));
            
            _timer.AddPoint("Load");

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
                        UserId = userId,
                        RealmId = realm.Id,
                        Name = guildName,
                    };
                    Context.PlayerGuild.Add(guild);
                }
                
                await HandleGuildItems(guild, guildData);
            }

            await Context.SaveChangesAsync();
            
            _timer.AddPoint("Guilds");
            
            // Deal with character data
            int accountId = 0;
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
                    Logger.Warning("Invalid character: {AddonId}", addonId);
                    continue;
                }

                //Logger.Debug("Found character: {0} => {1}", addonId, character.Id);
                accountId = character.AccountId.Value;
                
                character.LastSeenAddon = characterData.LastSeen.AsUtcDateTime();
                
                character.ChromieTime = characterData.ChromieTime;
                character.Copper = characterData.Copper;
                character.IsResting = characterData.IsResting;
                character.IsWarMode = characterData.IsWarMode;
                character.MountSkill = Enum.IsDefined(typeof(WowMountSkill), characterData.MountSkill) ? (WowMountSkill)characterData.MountSkill : 0;
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

                HandleAchievements(character, characterData);
                HandleCovenants(character, characterData);
                HandleCurrencies(character, characterData);
                await HandleItems(character, characterData);
                HandleLockouts(character, characterData);
                HandleMounts(character, characterData);
                HandleMythicPlus(character, characterData);
                HandleQuests(character, characterData);
                HandleReputations(character, characterData);
                HandleTransmog(character, characterData);
                HandleWeekly(character, characterData);
            }
            _timer.AddPoint("Characters");

            // Deal with account data
            if (accountId > 0)
            {
                var accountToys = await Context.PlayerAccountToys.FindAsync(accountId);
                if (accountToys == null)
                {
                    accountToys = new PlayerAccountToys
                    {
                        AccountId = accountId,
                    };
                    Context.PlayerAccountToys.Add(accountToys);
                }

                if (parsed.Toys?.Count > 0)
                {
                    accountToys.ToyIds = parsed.Toys
                        .OrderBy(toyId => toyId)
                        .ToList();
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
            
            await Context.SaveChangesAsync();
            _timer.AddPoint("Save");
            
            Logger.Information("{0}", _timer.ToString());
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
        }

        private void HandleCovenants(PlayerCharacter character, UploadCharacter characterData)
        {
            if (character.Shadowlands == null)
            {
                return;
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
            Context.Entry(character.Shadowlands).Property(cs => cs.Covenants).IsModified = true;
        }

        private PlayerCharacterShadowlandsCovenantFeature HandleCovenantsFeature(
            PlayerCharacterShadowlandsCovenantFeature feature,
            UploadCharacterCovenantFeature featureData
        )
        {
            if (featureData == null || featureData.Rank == 0)
            {
                return feature;
            }
            else
            {
                return new PlayerCharacterShadowlandsCovenantFeature
                {
                    Rank = Math.Max(0, Math.Min(5, featureData.Rank)),
                    ResearchEnds = featureData.ResearchEnds ?? 0,
                    Name = featureData.Name.EmptyIfNullOrWhitespace().Truncate(32),
                };
            }
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
        
        private void HandleCurrencies(PlayerCharacter character, UploadCharacter characterData)
        {
            var currencyMap = character.Currencies
                .EmptyIfNull()
                .ToDictionary(currency => currency.CurrencyId);

            foreach (var (currencyId, currencyString) in characterData.Currencies.EmptyIfNull())
            {
                // quantity:max:isWeekly:weekQuantity:weekMax:isMovingMax:totalQuantity
                var parts = currencyString.Split(":");
                if (parts.Length != 7)
                {
                    Logger.Warning("Invalid currency string: {String}", currencyString);
                    continue;
                }

                if (!currencyMap.TryGetValue(currencyId, out var currency))
                {
                    currency = new PlayerCharacterCurrency
                    {
                        CharacterId = character.Id,
                        CurrencyId = currencyId,
                    };
                    Context.PlayerCharacterCurrency.Add(currency);
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

        private async Task HandleGuildItems(PlayerGuild guild, UploadGuild guildData)
        {
            var itemMap = guild.Items
                .EmptyIfNull()
                .GroupBy(item => (item.TabId, item.Slot))
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .OrderBy(item => item.Id)
                        .First()
                );

            // (tab, slot)
            var seen = new HashSet<(short, short)>();
            foreach (var (tab, contents) in guildData.Items.EmptyIfNull())
            {
                short tabId = short.Parse(tab[1..]);
                foreach (var (slotString, itemString) in contents)
                {
                    var slot = short.Parse(slotString[1..]);
                    
                    var parts = itemString.Split(":");
                    if (parts.Length != 9 && !(parts.Length == 4 && parts[0] == "pet"))
                    {
                        Logger.Warning("Invalid item string: {String}", itemString);
                        continue;
                    }
                    
                    var key = (tabId, slot);
                    if (!itemMap.TryGetValue(key, out var item))
                    {
                        item = new PlayerGuildItem
                        {
                            Guild = guild,
                            TabId = tabId,
                            Slot = slot,
                        };
                        Context.PlayerGuildItem.Add(item);
                    }

                    AddItemDetails(item, parts);
                    seen.Add(key);
                }
            }
            
            var deleteMe = itemMap
                .Where(kvp => !seen.Contains(kvp.Key))
                .Select(kvp => kvp.Value.Id)
                .ToArray();
            if (deleteMe.Length > 0)
            {
                await Context.DeleteRangeAsync<PlayerGuildItem>(item => deleteMe.Contains(item.Id));
            }
        }

        private async Task HandleItems(PlayerCharacter character, UploadCharacter characterData)
        {
            var itemMap = character.Items
                .EmptyIfNull()
                .GroupBy(item => (item.Location, item.BagId, item.Slot))
                .ToDictionary(
                    group => group.Key,
                    group => group
                        .OrderBy(item => item.Id)
                        .First()
                    );

            var seen = new HashSet<(ItemLocation, short, short)>();
            foreach (var (location, contents) in characterData.Items.EmptyIfNull())
            {
                ItemLocation locationType = ItemLocation.Unknown;
                if (!location.StartsWith("b"))
                {
                    Logger.Warning("Invalid item location: {Location}", location);
                    continue;
                }

                short bagId = short.Parse(location[1..]);
                if (bagId >= 0 && bagId <= 4)
                {
                    locationType = ItemLocation.Bags;
                }
                else if (bagId == -1 || (bagId >= 5 && bagId <= 11))
                {
                    locationType = ItemLocation.Bank;
                }
                else if (bagId == -3)
                {
                    locationType = ItemLocation.ReagentBank;
                }

                foreach (var (slotString, itemString) in contents)
                {
                    var slot = short.Parse(slotString[1..]);
                    // count:id:context:enchant:ilvl:quality:suffix:bonusIDs:gems
                    var parts = itemString.Split(":");
                    if (parts.Length != 9 && !(parts.Length == 4 && parts[0] == "pet"))
                    {
                        Logger.Warning("Invalid item string: {String}", itemString);
                        continue;
                    }
                    
                    var key = (locationType, bagId, slot);
                    if (!itemMap.TryGetValue(key, out var item))
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

                    AddItemDetails(item, parts);
                    seen.Add(key);
                }
            }

            var deleteMe = itemMap
                .Where(kvp => !seen.Contains(kvp.Key))
                .Select(kvp => kvp.Value.Id)
                .ToArray();
            if (deleteMe.Length > 0)
            {
                await Context.DeleteRangeAsync<PlayerCharacterItem>(item => deleteMe.Contains(item.Id));
            }
        }

        private void AddItemDetails(IPlayerItem item, string[] parts)
        {
            if (parts[0] == "pet")
            {
                // pet:speciesId:level:quality
                item.Count = 1;
                item.ItemId = 82800; // Pet Cage
                item.Context = short.Parse(parts[1]); // SpeciesId
                item.ItemLevel = short.Parse(parts[2]); // Level
                item.Quality = short.Parse(parts[3]); // Quality
                item.BonusIds = new List<short>();
                item.Gems = new List<int>();
            }
            else
            {
                // count:id:context:enchant:ilvl:quality:suffix:bonusIDs:gems
                item.Count = int.Parse(parts[0]);
                item.ItemId = int.Parse(parts[1]);
                item.Context = short.Parse(parts[2].OrDefault("0"));
                item.EnchantId = short.Parse(parts[3].OrDefault("0"));
                item.ItemLevel = short.Parse(parts[4].OrDefault("0"));
                item.Quality = short.Parse(parts[5].OrDefault("0"));
                item.SuffixId = short.Parse(parts[6].OrDefault("0"));

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
            }
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
                character.AddonMounts.Mounts = characterData.Mounts
                    .EmptyIfNull()
                    .OrderBy(mountId => mountId)
                    .ToList();
            }
        }

        private void HandleMythicPlus(PlayerCharacter character, UploadCharacter characterData)
        {
            if (characterData.MythicPlus == null)
            {
                return;
            }
            
            if (character.MythicPlusAddon == null)
            {
                character.MythicPlusAddon = new PlayerCharacterMythicPlusAddon
                {
                    Character = character,
                };
                Context.PlayerCharacterMythicPlusAddon.Add(character.MythicPlusAddon);
            }

            character.MythicPlusAddon.Maps = new Dictionary<int, PlayerCharacterMythicPlusAddonMap>();
            character.MythicPlusAddon.Season = characterData.MythicPlus.Season;

            foreach (var map in characterData.MythicPlus.Maps.EmptyIfNull())
            {
                var mapData = character.MythicPlusAddon.Maps[map.MapId] = new PlayerCharacterMythicPlusAddonMap();
                mapData.OverallScore = map.OverallScore;

                foreach (var mapScore in map.AffixScores.EmptyIfNull())
                {
                    // TODO check if ths is different in non-English clients
                    if (mapScore.Name == "Fortified")
                    {
                        mapData.FortifiedScore = new PlayerCharacterMythicPlusAddonMapScore
                        {
                            OverTime = mapScore.OverTime,
                            DurationSec = mapScore.DurationSec,
                            Level = mapScore.Level,
                            Score = mapScore.Score,
                        };
                    }
                    else if (mapScore.Name == "Tyrannical")
                    {
                        mapData.TyrannicalScore = new PlayerCharacterMythicPlusAddonMapScore
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

        private void HandleQuests(PlayerCharacter character, UploadCharacter characterData)
        {
            bool hasCallings = characterData.ScanTimes.TryGetValue("callings", out int callingsScanTimestamp);
            bool hasQuests = characterData.ScanTimes.TryGetValue("quests", out int questsScanTimestamp);
            if (!hasCallings && !hasQuests)
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

            if (callingsScanTimestamp > 0)
            {
                var scanTime = callingsScanTimestamp.AsUtcDateTime();
                if (scanTime >= character.AddonQuests.CallingsScannedAt)
                {
                    character.AddonQuests.CallingsScannedAt = scanTime;
                    character.AddonQuests.CallingCompleted = characterData.Callings
                        .EmptyIfNull()
                        .Select(calling => calling.Completed)
                        .ToList();
                    character.AddonQuests.CallingExpires = characterData.Callings
                        .EmptyIfNull()
                        .Select(calling => calling.Expires)
                        .ToList();
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

            var transmog = characterData.Transmog
                .EmptyIfNullOrWhitespace()
                .Split(':', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToList();
            if (transmog.Count > 0)
            {
                character.Transmog.TransmogIds = transmog;
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
            }

            character.Weekly.KeystoneDungeon = characterData.KeystoneInstance;
            character.Weekly.KeystoneLevel = characterData.KeystoneLevel;

            // Torghast
            if (characterData.ScanTimes.TryGetValue("torghast", out int torghastScanned) && characterData.Torghast?.Count == 2)
            {
                character.Weekly.TorghastScannedAt = torghastScanned.AsUtcDateTime();
                character.Weekly.Torghast = new();
                foreach (var wing in characterData.Torghast)
                {
                    character.Weekly.Torghast[wing.Name.Truncate(32)] = Math.Max(0, Math.Min(32, wing.Level));
                } 
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

            // Ugh, quests
            if (characterData.ScanTimes.TryGetValue("quests", out int questsScanned) && characterData.WeeklyUghQuests != null)
            {
                character.Weekly.UghQuestsScannedAt = questsScanned.AsUtcDateTime();
                
                character.Weekly.UghQuests = new Dictionary<string, PlayerCharacterWeeklyUghQuest>();

                foreach (var (questKey, questData) in characterData.WeeklyUghQuests)
                {
                    character.Weekly.UghQuests[questKey.Truncate(32)] = new PlayerCharacterWeeklyUghQuest
                    {
                        Have = questData.Have,
                        Need = questData.Need,
                        Status = questData.Status,
                        Text = questData.Text?.Truncate(64),
                        Type = questData.Type?.Truncate(16),
                    };
                }
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
    }
}
