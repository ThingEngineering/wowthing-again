using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoreLinq;
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

        public override async Task Run(params string[] data)
        {
            _timer = new JankTimer();

            int userId = int.Parse(data[0]);
            using var shrug = UserLog(userId);

            Logger.Information("Processing upload...");

            var json = LuaToJsonConverter.Convert(data[1].Replace("WWTCSaved = ", ""));
            var parsed = JsonConvert.DeserializeObject<Upload[]>(json)[0]; // TODO work out why this is an array of objects
            _timer.AddPoint("Parse");
            
            // Fetch character data for this account
            var characterMap = await Context.PlayerCharacter
                .Where(c => c.Account.UserId == userId)
                .Include(c => c.AddonMounts)
                .Include(c => c.AddonQuests)
                .Include(c => c.Currencies)
                .Include(c => c.Lockouts)
                .Include(c => c.MythicPlusAddon)
                .Include(c => c.Reputations)
                .Include(c => c.Weekly)
                .ToDictionaryAsync(k => (k.RealmId, k.Name));

            var realmIds = characterMap.Values
                .Select(c => c.RealmId)
                .Distinct()
                .ToArray();
            var realmMap = await Context.WowRealm
                .Where(r => realmIds.Contains(r.Id))
                .ToDictionaryAsync(k => (k.Region, k.Name));
            
            _timer.AddPoint("Load");

            // Deal with character data
            int accountId = 0;
            var transmog = new HashSet<int>();
            foreach (var (addonId, characterData) in parsed.Characters)
            {
                // US/Mal'Ganis/Fakenamehere
                var parts = addonId.Split("/");
                if (parts.Length != 3)
                {
                    continue;
                }

                var region = Enum.Parse<WowRegion>(parts[0]);
                if (!realmMap.TryGetValue((region, parts[1]), out WowRealm realm))
                {
                    Logger.Warning("Invalid realm: {0}/{1}", parts[0], parts[1]);
                    continue;
                }

                if (!characterMap.TryGetValue((realm.Id, parts[2]), out PlayerCharacter character))
                {
                    Logger.Warning("Invalid character: {0}/{1}/{2}", parts[0], parts[1], parts[2]);
                    continue;
                }

                //Logger.Debug("Found character: {0} => {1}", addonId, character.Id);
                accountId = character.AccountId.Value;

                character.ChromieTime = characterData.ChromieTime;
                character.Copper = characterData.Copper;
                character.IsResting = characterData.IsResting;
                character.IsWarMode = characterData.IsWarMode;
                character.MountSkill = Enum.IsDefined(typeof(WowMountSkill), characterData.MountSkill) ? (WowMountSkill)characterData.MountSkill : 0;

                transmog.UnionWith(characterData.Transmog.EmptyIfNull());

                HandleCurrencies(character, characterData);
                HandleLockouts(character, characterData);
                HandleMounts(character, characterData);
                HandleMythicPlus(character, characterData);
                HandleQuests(character, characterData);
                HandleReputations(character, characterData);
                HandleWeekly(character, characterData);
            }
            _timer.AddPoint("Characters");

            // Deal with account data
            if (accountId > 0)
            {
                if (parsed.Toys != null)
                {
                    var accountToys = Context.PlayerAccountToys.Find(accountId);
                    if (accountToys == null)
                    {
                        accountToys = new PlayerAccountToys
                        {
                            AccountId = accountId,
                        };
                        Context.PlayerAccountToys.Add(accountToys);
                    }

                    accountToys.ToyIds = parsed.Toys.OrderBy(t => t).ToList();
                }

                var accountTransmog = Context.PlayerAccountTransmog.Find(accountId);
                if (accountTransmog == null)
                {
                    accountTransmog = new PlayerAccountTransmog
                    {
                        AccountId = accountId,
                    };
                    Context.PlayerAccountTransmog.Add(accountTransmog);
                }

                accountTransmog.TransmogIds = transmog
                    .OrderBy(t => t)
                    .ToList();
            }
            _timer.AddPoint("Account");

            await Context.SaveChangesAsync();
            _timer.AddPoint("Save");
            
            Logger.Information("{0}", _timer.ToString());
        }

        private void HandleCurrencies(PlayerCharacter character, UploadCharacter characterData)
        {
            if (character.Currencies == null)
            {
                character.Currencies = new PlayerCharacterCurrencies
                {
                    Character = character,
                };
                Context.PlayerCharacterCurrencies.Add(character.Currencies);
            }

            character.Currencies.Currencies = new Dictionary<int, PlayerCharacterCurrenciesCurrency>();

            foreach (var currency in characterData.Currencies.EmptyIfNull())
            {
                character.Currencies.Currencies[currency.Id] = new PlayerCharacterCurrenciesCurrency
                {
                    Total = currency.Total,
                    TotalMax = currency.MaxTotal,
                    Week = currency.Week,
                    WeekMax = currency.MaxWeek,
                };
            }
        }

        private void HandleLockouts(PlayerCharacter character, UploadCharacter characterData)
        {
            if (character.Lockouts == null)
            {
                character.Lockouts = new PlayerCharacterLockouts
                {
                    Character = character,
                };
                Context.PlayerCharacterLockouts.Add(character.Lockouts);
            }

            if (characterData.ScanTimes.TryGetValue("lockouts", out int lockoutsScanned) && characterData.Lockouts != null)
            {
                character.Lockouts.LastUpdated = lockoutsScanned.AsUtcDateTime();
                character.Lockouts.Lockouts = new List<PlayerCharacterLockoutsLockout>();

                foreach (var lockoutData in characterData.Lockouts)
                {
                    character.Lockouts.Lockouts.Add(new PlayerCharacterLockoutsLockout
                    {
                        Locked = lockoutData.Locked,
                        DefeatedBosses = lockoutData.DefeatedBosses,
                        Difficulty = lockoutData.Difficulty,
                        Id = lockoutData.Id,
                        MaxBosses = lockoutData.MaxBosses,
                        Name = lockoutData.Name.Truncate(32),
                        ResetTime = lockoutData.ResetTime.AsUtcDateTime(),
                        Bosses = lockoutData.Bosses.EmptyIfNull()
                            .Select(boss => new PlayerCharacterLockoutsLockoutBoss
                            {
                                Dead = boss.Dead,
                                Name = boss.Name.Truncate(32),
                            }).ToList(),
                    });
                }
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
                character.AddonMounts.Mounts = characterData.Mounts.EmptyIfNull();
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
            if (!characterData.ScanTimes.TryGetValue("quests", out int scanTimestamp))
            {
                return;
            }
            var scanTime = scanTimestamp.AsUtcDateTime();
            
            if (character.AddonQuests == null)
            {
                character.AddonQuests = new PlayerCharacterAddonQuests
                {
                    CharacterId = character.Id,
                };
                Context.PlayerCharacterAddonQuests.Add(character.AddonQuests);
            }

            if (scanTime > character.AddonQuests.ScannedAt)
            {
                character.AddonQuests.ScannedAt = scanTime;
                character.AddonQuests.DailyQuests = characterData.DailyQuests.EmptyIfNull();
            }
        }

        private void HandleReputations(PlayerCharacter character, UploadCharacter characterData)
        {
            if (character.Reputations == null)
            {
                return;
            }

            character.Reputations.ExtraReputationIds = characterData.Reputations
                .EmptyIfNull()
                .Select(r => r.Id)
                .ToList();
            
            character.Reputations.ExtraReputationValues = characterData.Reputations
                .EmptyIfNull()
                .Select(r => r.Value)
                .ToList();
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
            if (characterData.ScanTimes.TryGetValue("vault", out int vaultScanned) && characterData.MythicDungeons != null && characterData.Vault != null)
            {
                character.Weekly.Vault.ScannedAt = vaultScanned.AsUtcDateTime();

                character.Weekly.Vault.MythicPlusRuns = characterData.MythicDungeons
                    .Select(d => new List<int> { d.Map, d.Level })
                    .ToList();

                // https://wowpedia.fandom.com/wiki/API_C_WeeklyRewards.GetActivities
                character.Weekly.Vault.MythicPlusProgress = ConvertVault(characterData.Vault[0]);
                character.Weekly.Vault.RankedPvpProgress = ConvertVault(characterData.Vault[1]);
                character.Weekly.Vault.RaidProgress = ConvertVault(characterData.Vault[2]);

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
