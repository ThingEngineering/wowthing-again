using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Models
{
    public class UserApiCharacter
    {
        public bool IsResting { get; set; }
        public bool IsWarMode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? AccountId { get; set; }
        public int ActiveSpecId { get; }
        public int ChromieTime { get; set; }
        public int ClassId { get; set; }
        public int EquippedItemLevel { get; set; }
        public int Id { get; }
        public int Level { get; set; }
        public int RaceId { get; set; }
        public int RealmId { get; set; }
        public long Gold { get; }
        public string Name { get; set; }
        public WowFaction Faction { get; set; }
        public WowGender Gender { get; set; }
        public WowMountSkill MountSkill { get; set; }

        public Dictionary<int, PlayerCharacterCurrenciesCurrency> Currencies { get; }
        public Dictionary<int, UserApiCharacterEquippedItem> EquippedItems { get; set; } = new Dictionary<int, UserApiCharacterEquippedItem>();
        public Dictionary<string, PlayerCharacterLockoutsLockout> Lockouts { get; }
        public UserApiCharacterMythicPlus MythicPlus { get; }
        public Dictionary<int, int> Quests { get; set; } = new Dictionary<int, int>();
        public Dictionary<int, PlayerCharacterRaiderIoSeasonScores> RaiderIo { get; }
        public Dictionary<int, int> Reputations { get; set; } = new Dictionary<int, int>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public UserApiCharacterShadowlands Shadowlands { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public UserApiCharacterWeekly Weekly { get; }

        public UserApiCharacter(PlayerCharacter character, bool pub = false, bool anon = false)
        {
            ActiveSpecId = character.ActiveSpecId;
            ClassId = character.ClassId;
            EquippedItemLevel = character.EquippedItemLevel;
            Faction = character.Faction;
            Gender = character.Gender;
            Id = character.Id;
            Level = character.Level;
            MountSkill = character.MountSkill;
            RaceId = character.RaceId;

            if (pub && anon)
            {
                Name = "SecretGoose";
            }
            else
            {
                Name = character.Name;
                RealmId = character.RealmId;
            }

            if (!pub)
            {
                AccountId = character.AccountId;
                ChromieTime = character.ChromieTime;
                Currencies = character.Currencies?.Currencies;
                Gold = (character?.Copper ?? 0) / 10000;
                IsResting = character.IsResting;
                IsWarMode = character.IsWarMode;
            }

            if (character.EquippedItems?.Items != null)
            {
                EquippedItems = character.EquippedItems.Items
                    .ToDictionary(k => (int)k.Key, v => new UserApiCharacterEquippedItem(v.Value));
            }

            if (character.Lockouts != null)
            {
                Lockouts = character.Lockouts.Lockouts
                    .Where(l => l.ResetTime >= DateTime.UtcNow)
                    .GroupBy(l => $"{l.Id}-{l.Difficulty}")
                    .ToDictionary(
                        k => k.Key,
                        v => v.OrderByDescending(l => l.ResetTime).First()
                    );
            }

            if (character.MythicPlus != null)
            {
                MythicPlus = new UserApiCharacterMythicPlus(character.MythicPlus, character.MythicPlusSeasons);
            }

            if (character.Quests != null)
            {
                Quests = character.Quests.CompletedIds
                    .ToDictionary(k => k, v => 1);
            }

            if (character.RaiderIo != null)
            {
                RaiderIo = character.RaiderIo.Seasons;
            }

            if (character.Reputations?.ReputationIds != null && character.Reputations?.ReputationValues != null)
            {
                Reputations = character.Reputations.ReputationIds
                    .Zip(character.Reputations.ReputationValues)
                    .ToDictionary(k => k.First, v => v.Second);
            }

            if (character.Shadowlands != null)
            {
                Shadowlands = new UserApiCharacterShadowlands(character.Shadowlands);
            }

            if (character.Weekly != null)
            {
                Weekly = new UserApiCharacterWeekly(character.Weekly, pub);
            }
        }
    }

    public class UserApiCharacterEquippedItem
    {
        public int Context { get; set; }
        public int ItemId { get; set; }
        public int ItemLevel { get; set; }
        public WowQuality Quality { get; set; }

        public List<int> BonusIds { get; set; }
        public List<int> EnchantmentIds { get; set; }

        public UserApiCharacterEquippedItem(PlayerCharacterEquippedItem equippedItem)
        {
            Context = equippedItem.Context;
            ItemId = equippedItem.ItemId;
            ItemLevel = equippedItem.ItemLevel;
            Quality = equippedItem.Quality;

            BonusIds = equippedItem.BonusIds;
            EnchantmentIds = equippedItem.EnchantmentIds;
        }
    }

    public class UserApiCharacterMythicPlus
    {
        public int CurrentPeriodId { get; }
        public Dictionary<int, List<PlayerCharacterMythicPlusRun>> PeriodRuns { get; }
        public Dictionary<int, Dictionary<int, List<PlayerCharacterMythicPlusRun>>> Seasons { get; }

        public UserApiCharacterMythicPlus(PlayerCharacterMythicPlus mythicPlus, List<PlayerCharacterMythicPlusSeason> seasons)
        {
            CurrentPeriodId = mythicPlus.CurrentPeriodId;
            PeriodRuns = mythicPlus.PeriodRuns
                .GroupBy(k => k.DungeonId)
                .ToDictionary(k => k.Key, v => v.ToList());
            Seasons = seasons
                .ToDictionary(k => k.Season, v => v.Runs
                    .GroupBy(k => k.DungeonId)
                    .ToDictionary(k => k.Key, v => v.OrderByDescending(r => r.Timed).ToList())
                );
        }
    }

    public class UserApiCharacterShadowlands
    {
        public int CovenantId { get; }
        public int RenownLevel { get; }
        public int SoulbindId { get; }
        public List<int[]> Conduits { get; }

        public UserApiCharacterShadowlands(PlayerCharacterShadowlands shadowlands)
        {
            CovenantId = shadowlands.CovenantId;
            RenownLevel = shadowlands.RenownLevel;
            SoulbindId = shadowlands.SoulbindId;

            Conduits = shadowlands.ConduitIds.Zip(shadowlands.ConduitRanks)
                .Select(z => new int[] { z.First, z.Second }).ToList();
        }
    }

    public class UserApiCharacterWeekly
    {
        public int KeystoneDungeon { get; set; }
        public int KeystoneLevel { get; set; }
        public Dictionary<string, int> Torghast { get; set; }
        public PlayerCharacterWeeklyVault Vault { get; set; } = new PlayerCharacterWeeklyVault();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, PlayerCharacterWeeklyUghQuest> UghQuests { get; set; }

        public UserApiCharacterWeekly(PlayerCharacterWeekly weekly, bool pub)
        {
            KeystoneDungeon = weekly.KeystoneDungeon;
            KeystoneLevel = weekly.KeystoneLevel;
            Torghast = weekly.Torghast;
            Vault = weekly.Vault;

            if (!pub)
            {
                UghQuests = weekly.UghQuests;
            }
        }
    }
}
