using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacter
{
    public long Id { get; set; }

    [JsonProperty("average_item_level")]
    [JsonPropertyName("average_item_level")]
    public int AverageItemLevel { get; set; }

    [JsonProperty("equipped_item_level")]
    [JsonPropertyName("equipped_item_level")]
    public int EquippedItemLevel { get; set; }

    public int Experience { get; set; }

    public int Level { get; set; }

    [JsonProperty("last_login_timestamp")]
    [JsonPropertyName("last_login_timestamp")]
    public long LastLogout { get; set; }

    public string Name { get; set; }

    public ApiTypeName Gender { get; set; }

    public ApiTypeName Faction { get; set; }

    public ApiObnoxiousObject Guild { get; set; }

    public ApiObnoxiousObject Race { get; set; }

    public ApiObnoxiousObject Realm { get; set; }

    [JsonProperty("active_spec")]
    [JsonPropertyName("active_spec")]
    public ApiObnoxiousObject ActiveSpec { get; set; }

    [JsonProperty("active_title")]
    [JsonPropertyName("active_title")]
    public ApiObnoxiousObject ActiveTitle { get; set; }

    [JsonProperty("character_class")]
    [JsonPropertyName("character_class")]
    public ApiObnoxiousObject Class { get; set; }

    [JsonProperty("covenant_progress")]
    [JsonPropertyName("covenant_progress")]
    public ApiCharacterCovenantProgress CovenantProgress { get; set; }

    // Link sections
    [JsonProperty("achievements")]
    [JsonPropertyName("achievements")]
    public ApiObnoxiousHref AchievementsLink { get; set; }

    [JsonProperty("collections")]
    [JsonPropertyName("collections")]
    public ApiObnoxiousHref CollectionsLink { get; set; }

    [JsonProperty("equipment")]
    [JsonPropertyName("equipment")]
    public ApiObnoxiousHref EquipmentLink { get; set; }

    [JsonProperty("media")]
    [JsonPropertyName("media")]
    public ApiObnoxiousHref MediaLink { get; set; }

    [JsonProperty("mythic_keystone_profile")]
    [JsonPropertyName("mythic_keystone_profile")]
    public ApiObnoxiousHref MythicKeystoneProfileLink { get; set; }

    [JsonProperty("professions")]
    [JsonPropertyName("professions")]
    public ApiObnoxiousHref ProfessionsLink { get; set; }

    [JsonProperty("quests")]
    [JsonPropertyName("quests")]
    public ApiObnoxiousHref QuestsLink { get; set; }

    [JsonProperty("reputations")]
    [JsonPropertyName("reputations")]
    public ApiObnoxiousHref ReputationsLink { get; set; }

    [JsonProperty("specializations")]
    [JsonPropertyName("specializations")]
    public ApiObnoxiousHref SpecializationsLink { get; set; }

    [JsonProperty("statistics")]
    [JsonPropertyName("statistics")]
    public ApiObnoxiousHref StatisticsLink { get; set; }

    [JsonProperty("titles")]
    [JsonPropertyName("titles")]
    public ApiObnoxiousHref TitlesLink { get; set; }
}

public class ApiCharacterCovenantProgress
{
    [JsonProperty("chosen_covenant")]
    [JsonPropertyName("chosen_covenant")]
    public ApiObnoxiousObject ChosenCovenant { get; set; }

    [JsonProperty("soulbinds")]
    [JsonPropertyName("soulbinds")]
    public ApiObnoxiousHref SoulbindsLink { get; set; }
}
