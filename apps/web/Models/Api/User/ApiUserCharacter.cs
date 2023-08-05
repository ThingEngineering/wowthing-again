using System.Text.Json.Serialization;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserCharacter
{
    public bool IsResting { get; set; }
    public bool IsWarMode { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? AccountId { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? GuildId { get; set; }

    public int ActiveSpecId { get; }
    public int AddonLevel { get; set; }
    public int AddonLevelXp { get; set; }
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
    public string CurrentLocation { get; set; }
    public string HearthLocation { get; set; }
    public string Name { get; set; }
    public DateTime LastSeenAddon { get; set; }
    public WowFaction Faction { get; set; }
    public WowGender Gender { get; set; }

    public ApiUserCharacterConfiguration Configuration { get; set; }

    public Dictionary<int, int> Auras { get; set; }
    public Dictionary<short, int> Bags { get; set; }
    public List<PlayerCharacterAddonDataCurrency> CurrenciesRaw { get; }
    public Dictionary<int, int> CurrencyItems { get; set; }
    public Dictionary<int, ApiUserCharacterEquippedItem> EquippedItems { get; }
    public Dictionary<int, PlayerCharacterAddonDataGarrison> Garrisons { get; }
    public Dictionary<int, Dictionary<int, List<int>>> GarrisonTrees { get; }
    public Dictionary<string, PlayerCharacterLockoutsLockout> Lockouts { get; }
    public ApiUserCharacterMythicPlus MythicPlus { get; }
    public Dictionary<int, PlayerCharacterAddonDataMythicPlus> MythicPlusAddon { get; }
    public Dictionary<int, Dictionary<int, PlayerCharacterAddonDataMythicPlusMap>> MythicPlusSeasons { get; set; }

    [JsonPropertyName("rawMythicPlusWeeks")]
    public Dictionary<int, List<ApiUserCharacterMythicPlusRun>> MythicPlusWeeks { get; set; }

    public Dictionary<int, Dictionary<int, PlayerCharacterProfessionTier>> Professions { get; }
    public Dictionary<int, Dictionary<int, int>> ProfessionTraits { get; set; }
    public int[] ProgressItems { get; set; }
    public Dictionary<int, PlayerCharacterRaiderIoSeasonScores> RaiderIo { get; }
    public Dictionary<int, PlayerCharacterReputationsParagon> Paragons { get; }
    public Dictionary<int, int> Reputations { get; } = new();

    [JsonPropertyName("specializationsRaw")]
    public Dictionary<int, PlayerCharacterSpecializationsSpecialization> Specializations { get; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ApiUserCharacterShadowlands Shadowlands { get; set; }

    [JsonPropertyName("rawStatistics")]
    public ApiUserCharacterStatistics Statistics { get; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public ApiUserCharacterWeekly Weekly { get; }

    public ApiUserCharacter(
        PlayerCharacter character,
        PlayerCharacterItem[] bagItems,
        PlayerCharacterItem[] currencyItems,
        PlayerCharacterItem[] progressItems,
        bool pub = false,
        ApplicationUserSettingsPrivacy privacy = null
    )
    {
        ActiveSpecId = character.ActiveSpecId;
        AddonLevel = character.AddonData?.Level ?? 0;
        AddonLevelXp = character.AddonData?.LevelXp ?? 0;
        ClassId = character.ClassId;
        EquippedItemLevel = character.EquippedItemLevel;
        Faction = character.Faction;
        Gender = character.Gender;
        GuildId = character.GuildId;
        Id = character.Id;
        Level = character.Level;
        RaceId = character.RaceId;

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

        if (!pub)
        {
            ChromieTime = character.ChromieTime;
            Gold = character.Copper / 10000;
            IsResting = character.IsResting;
            IsWarMode = character.IsWarMode;
            LastSeenAddon = character.LastSeenAddon;
            PlayedTotal = character.PlayedTotal;
            RestedExperience = character.RestedExperience;

            CurrentLocation = character.AddonData?.CurrentLocation;
            HearthLocation = character.AddonData?.BindLocation;
        }

        Auras = character.AddonData?.Auras;
        Garrisons = character.AddonData?.Garrisons;
        GarrisonTrees = character.AddonData?.GarrisonTrees;
        ProfessionTraits = character.AddonData?.ProfessionTraits;

        Professions = character.Professions?.Professions;
        Specializations = character.Specializations?.Specializations;

        Configuration = new ApiUserCharacterConfiguration(character.Configuration);
        Paragons = character.Reputations?.Paragons ?? new Dictionary<int, PlayerCharacterReputationsParagon>();

        Bags = bagItems
            .EmptyIfNull()
            .GroupBy(bi => bi.BagId)
            .ToDictionary(
                group => group.Key,
                group => group.First().ItemId
            );

        ProgressItems = progressItems
            .EmptyIfNull()
            .Select(pi => pi.ItemId)
            .Distinct()
            .ToArray();

        // Currencies
        if (!pub || privacy?.PublicCurrencies == true)
        {
            var currencyValues = character.AddonData?.Currencies?.Values.ToList();
            CurrenciesRaw = currencyValues.EmptyIfNull();

            CurrencyItems = currencyItems
                .EmptyIfNull()
                .GroupBy(ci => ci.ItemId)
                .ToDictionary(
                    group => group.Key,
                    group => group.Sum(ci => ci.Count)
                );
        }

        // Equipped Items
        if (character.EquippedItems?.Items != null)
        {
            EquippedItems = character.EquippedItems.Items
                .ToDictionary(
                    k => (int)k.Key,
                    v => new ApiUserCharacterEquippedItem(v.Value)
                );
        }
        else
        {
            EquippedItems = new();
        }

        if (character.AddonData?.EquippedItems != null)
        {
            foreach ((int slot, var equippedItem) in character.AddonData.EquippedItems)
            {
                EquippedItems[slot] = new ApiUserCharacterEquippedItem(equippedItem);
            }
        }

        // Lockouts
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

        // Mythic+
        if (!pub || privacy?.PublicMythicPlus == true)
        {
            if (character.MythicPlus != null)
            {
                MythicPlus = new ApiUserCharacterMythicPlus(character.MythicPlus, character.MythicPlusSeasons,
                    pub && privacy?.Anonymized == true);
            }

            MythicPlusAddon = character.AddonData?.MythicPlus;
            MythicPlusSeasons = character.AddonData?.MythicPlusSeasons;

            if (character.AddonData?.MythicPlusWeeks != null)
            {
                MythicPlusWeeks = character.AddonData.MythicPlusWeeks
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value
                            .Select(run => new ApiUserCharacterMythicPlusRun(run))
                            .ToList()
                    );
                RaiderIo = character.RaiderIo?.Seasons;
            }
        }

        // Reputations
        if (character.Reputations?.ReputationIds != null && character.Reputations?.ReputationValues != null)
        {
            Reputations = character.Reputations.ReputationIds
                .Concat(character.Reputations.ExtraReputationIds.EmptyIfNull())
                .Zip(character.Reputations.ReputationValues.Concat(character.Reputations.ExtraReputationValues
                    .EmptyIfNull()))
                .ToDictionary(k => k.First, v => v.Second);
        }

        // Shadowlands
        if (character.Shadowlands != null)
        {
            Shadowlands = new ApiUserCharacterShadowlands(character.Shadowlands);
        }

        // Stats
        if (character.Stats != null)
        {
            Statistics = new ApiUserCharacterStatistics(character.Stats);
        }

        // Weekly
        if (character.Weekly != null)
        {
            Weekly = new ApiUserCharacterWeekly(character.Weekly, pub, privacy);
        }
    }
}
