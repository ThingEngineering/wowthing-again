using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Web.Converters;

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
        public int PlayedTotal { get; set; }
        public int RaceId { get; set; }
        public int RealmId { get; set; }
        public int RestedExperience { get; set; }
        public long Gold { get; }
        public string Name { get; set; }
        public DateTime LastSeenAddon { get; set; }
        public WowFaction Faction { get; set; }
        public WowGender Gender { get; set; }
        public WowMountSkill MountSkill { get; set; }

        public Dictionary<short, int> Bags { get; set; }
        public List<UserApiCharacterCurrency> CurrenciesRaw { get; }
        public Dictionary<int, UserApiCharacterEquippedItem> EquippedItems { get; } = new();
        public Dictionary<int, Dictionary<int, List<int>>> GarrisonTrees { get; }
        public Dictionary<string, PlayerCharacterLockoutsLockout> Lockouts { get; }
        public UserApiCharacterMythicPlus MythicPlus { get; }
        public Dictionary<int, PlayerCharacterAddonDataMythicPlus> MythicPlusAddon { get; }
        public Dictionary<int, Dictionary<int, PlayerCharacterProfessionTier>> Professions { get; }
        public int[] ProgressItems { get; set; }
        public Dictionary<int, PlayerCharacterRaiderIoSeasonScores> RaiderIo { get; }
        public Dictionary<int, PlayerCharacterReputationsParagon> Paragons { get; }
        public Dictionary<int, int> Reputations { get; } = new();
        
        [JsonProperty("specializationsRaw")]
        public Dictionary<int, PlayerCharacterSpecializationsSpecialization> Specializations { get; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public UserApiCharacterShadowlands Shadowlands { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public UserApiCharacterWeekly Weekly { get; }

        public UserApiCharacter(
            PlayerCharacter character,
            IEnumerable<PlayerCharacterItem> bagItems,
            IEnumerable<PlayerCharacterItem> progressItems,
            bool pub = false,
            ApplicationUserSettingsPrivacy privacy = null
        )
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

            Professions = character.Professions?.Professions;
            Specializations = character.Specializations?.Specializations;

            if (pub && privacy?.Anonymized == true)
            {
                Name = $"Goose{Id:X4}";
            }
            else
            {
                Name = character.Name;
                RealmId = character.RealmId;
            }

            if (!pub || privacy?.PublicAccounts == true)
            {
                AccountId = character.AccountId;
            }

            if (!pub || privacy?.PublicCurrencies == true)
            {
                CurrenciesRaw = character.Currencies
                    .EmptyIfNull()
                    .Select(pcc => new UserApiCharacterCurrency(pcc))
                    .ToList();
            }

            if (!pub)
            {
                ChromieTime = character.ChromieTime;
                Gold = character.Copper / 10000;
                IsResting = character.IsResting;
                IsWarMode = character.IsWarMode;
                LastSeenAddon = character.LastSeenAddon;
                PlayedTotal = character.PlayedTotal;
                RestedExperience = character.RestedExperience;
            }

            GarrisonTrees = character.AddonData?.GarrisonTrees;

            Bags = bagItems
                .GroupBy(bi => bi.BagId)
                .ToDictionary(
                    group => group.Key,
                    group => group.First().ItemId
                );
            
            ProgressItems = progressItems
                .Select(pi => pi.ItemId)
                .Distinct()
                .ToArray();
            
            if (character.EquippedItems?.Items != null)
            {
                EquippedItems = character.EquippedItems.Items
                    .ToDictionary(k => (int)k.Key, v => new UserApiCharacterEquippedItem(v.Value));
            }

            if ((!pub || privacy?.PublicLockouts == true) && character.Lockouts?.Lockouts != null)
            {
                Lockouts = character.Lockouts.Lockouts
                    .Where(l => l.ResetTime >= DateTime.UtcNow)
                    .GroupBy(l => $"{l.Id}-{l.Difficulty}")
                    .ToDictionary(
                        k => k.Key,
                        v => v.OrderByDescending(l => l.ResetTime).First()
                    );
            }

            if (!pub || privacy?.PublicMythicPlus == true)
            {
                if (character.MythicPlus != null)
                {
                    MythicPlus = new UserApiCharacterMythicPlus(character.MythicPlus, character.MythicPlusSeasons,
                        pub && privacy?.Anonymized == true);
                }

                MythicPlusAddon = character.AddonData?.MythicPlus;
                RaiderIo = character.RaiderIo?.Seasons;
            }

            Paragons = character.Reputations?.Paragons ?? new Dictionary<int, PlayerCharacterReputationsParagon>();

            if (character.Reputations?.ReputationIds != null && character.Reputations?.ReputationValues != null)
            {
                Reputations = character.Reputations.ReputationIds.Concat(character.Reputations.ExtraReputationIds.EmptyIfNull())
                    .Zip(character.Reputations.ReputationValues.Concat(character.Reputations.ExtraReputationValues.EmptyIfNull()))
                    .ToDictionary(k => k.First, v => v.Second);
            }

            if (character.Shadowlands != null)
            {
                Shadowlands = new UserApiCharacterShadowlands(character.Shadowlands);
            }

            if (character.Weekly != null)
            {
                Weekly = new UserApiCharacterWeekly(character.Weekly, pub, privacy);
            }
        }
    }

    [JsonConverter(typeof(UserApiCharacterCurrencyConverter))]
    public class UserApiCharacterCurrency
    {
        public int Quantity { get; set; }
        public int Max { get; set; }
        public int WeekQuantity { get; set; }
        public int WeekMax { get; set; }
        public int TotalQuantity { get; set; }

        public short Id { get; set; }

        public bool IsWeekly { get; set; }
        public bool IsMovingMax { get; set; }

        public UserApiCharacterCurrency(PlayerCharacterCurrency currency)
        {
            Quantity = currency.Quantity;
            Max = currency.Max;
            WeekQuantity = currency.WeekQuantity;
            WeekMax = currency.WeekMax;
            TotalQuantity = currency.TotalQuantity;
            Id = currency.CurrencyId;
            IsWeekly = currency.IsWeekly;
            IsMovingMax = currency.IsMovingMax;
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
        public List<int> GemIds { get; set; }

        public UserApiCharacterEquippedItem(PlayerCharacterEquippedItem equippedItem)
        {
            Context = equippedItem.Context;
            ItemId = equippedItem.ItemId;
            ItemLevel = equippedItem.ItemLevel;
            Quality = equippedItem.Quality;

            BonusIds = equippedItem.BonusIds;
            EnchantmentIds = equippedItem.EnchantmentIds;
            GemIds = equippedItem.GemIds;
        }
    }

    public class UserApiCharacterMythicPlus
    {
        public int CurrentPeriodId { get; }
        public Dictionary<int, List<PlayerCharacterMythicPlusRun>> PeriodRuns { get; }
        public Dictionary<int, Dictionary<int, List<PlayerCharacterMythicPlusRun>>> Seasons { get; }

        public UserApiCharacterMythicPlus(PlayerCharacterMythicPlus mythicPlus, List<PlayerCharacterMythicPlusSeason> seasons, bool anon)
        {
            CurrentPeriodId = mythicPlus.CurrentPeriodId;
            PeriodRuns = mythicPlus.PeriodRuns
                .EmptyIfNull()
                .GroupBy(k => k.DungeonId)
                .ToDictionary(k => k.Key, v => v.ToList());
            Seasons = seasons
                .EmptyIfNull()
                .ToDictionary(season => season.Season, season => season.Runs
                    .EmptyIfNull()
                    .GroupBy(run => run.DungeonId)
                    .ToDictionary(group => group.Key, group => group.OrderByDescending(r => r.Timed).ToList())
                );

            if (anon)
            {
                var allRuns = PeriodRuns.Values
                    .SelectMany(x => x)
                    .Concat(
                        Seasons.Values
                            .SelectMany(x => x.Values.SelectMany(y => y))
                    );
                
                foreach (var run in allRuns)
                {
                    run.Members = run.Members
                        .EmptyIfNull()
                        .Select(orig => new PlayerCharacterMythicPlusRunMember()
                        {
                            ItemLevel = orig.ItemLevel,
                            Name = "SecretGoose",
                            RealmId = 0,
                            SpecializationId = orig.SpecializationId,
                        })
                        .ToList();
                }
            }
        }
    }

    public class UserApiCharacterShadowlands
    {
        public int CovenantId { get; }
        public int RenownLevel { get; }
        public int SoulbindId { get; }

        public Dictionary<int, PlayerCharacterShadowlandsCovenant> Covenants { get; }
        public List<int[]> Conduits { get; }

        public UserApiCharacterShadowlands(PlayerCharacterShadowlands shadowlands)
        {
            CovenantId = shadowlands.CovenantId;
            RenownLevel = shadowlands.RenownLevel;
            SoulbindId = shadowlands.SoulbindId;

            Conduits = shadowlands.ConduitIds.Zip(shadowlands.ConduitRanks)
                .Select(z => new[] { z.First, z.Second }).ToList();

            Covenants = shadowlands.Covenants;
        }
    }

    public class UserApiCharacterWeekly
    {
        public DateTime KeystoneScannedAt { get; set; }
        public DateTime UghQuestsScannedAt { get; set; }

        public int KeystoneDungeon { get; set; }
        public int KeystoneLevel { get; set; }
        public PlayerCharacterWeeklyVault Vault { get; set; }

        public UserApiCharacterWeekly(PlayerCharacterWeekly weekly, bool pub, ApplicationUserSettingsPrivacy privacy)
        {
            Vault = weekly.Vault;

            if (!pub || privacy?.PublicMythicPlus == true)
            {
                KeystoneDungeon = weekly.KeystoneDungeon;
                KeystoneLevel = weekly.KeystoneLevel;
                KeystoneScannedAt = weekly.KeystoneScannedAt;
            }
        }
    }
}
