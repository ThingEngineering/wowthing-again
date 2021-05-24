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
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? AccountId { get; set; }
        public int ActiveSpecId { get; }
        public int ClassId { get; set; }
        public int EquippedItemLevel { get; set; }
        public int Level { get; set; }
        public int RaceId { get; set; }
        public int RealmId { get; set; }
        public string Name { get; set; }
        public WowFaction Faction { get; set; }
        public WowGender Gender { get; set; }

        public Dictionary<int, UserApiCharacterEquippedItem> EquippedItems { get; set; } = new Dictionary<int, UserApiCharacterEquippedItem>();

        public UserApiCharacterMythicPlus MythicPlus { get; }

        public Dictionary<int, int> Quests { get; set; } = new Dictionary<int, int>();

        public Dictionary<int, PlayerCharacterRaiderIoSeasonScores> RaiderIo { get; }

        public Dictionary<int, int> Reputations { get; set; } = new Dictionary<int, int>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public UserApiCharacterShadowlands Shadowlands { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public PlayerCharacterWeekly Weekly { get; }

        public UserApiCharacter(WowDbContext context, PlayerCharacter character, bool pub = false, bool anon = false)
        {
            ActiveSpecId = character.ActiveSpecId;
            ClassId = character.ClassId;
            EquippedItemLevel = character.EquippedItemLevel;
            Faction = character.Faction;
            Gender = character.Gender;
            Level = character.Level;
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
            }

            if (character.EquippedItems?.Items != null)
            {
                EquippedItems = character.EquippedItems.Items
                    .ToDictionary(k => (int)k.Key, v => new UserApiCharacterEquippedItem(v.Value));
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
                Weekly = character.Weekly;
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
                    .ToDictionary(k => k.Key, v => v.ToList())
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
}
