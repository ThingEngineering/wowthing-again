namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacter
{
    public long Id { get; set; }

    [JsonPropertyName("average_item_level")]
    public int AverageItemLevel { get; set; }

    [JsonPropertyName("equipped_item_level")]
    public int EquippedItemLevel { get; set; }

    public int Experience { get; set; }

    public int Level { get; set; }

    [JsonPropertyName("last_login_timestamp")]
    public long LastLogout { get; set; }

    public string Name { get; set; }

    public ApiTypeName Gender { get; set; }

    public ApiTypeName Faction { get; set; }

    public ApiObnoxiousObject Guild { get; set; }

    public ApiObnoxiousObject Race { get; set; }

    public ApiObnoxiousObject Realm { get; set; }

    [JsonPropertyName("active_spec")]
    public ApiObnoxiousObject ActiveSpec { get; set; }

    [JsonPropertyName("active_title")]
    public ApiObnoxiousObject ActiveTitle { get; set; }

    [JsonPropertyName("character_class")]
    public ApiObnoxiousObject Class { get; set; }

    [JsonPropertyName("covenant_progress")]
    public ApiCharacterCovenantProgress CovenantProgress { get; set; }

    // Link sections
    [JsonPropertyName("achievements")]
    public ApiObnoxiousHref AchievementsLink { get; set; }

    [JsonPropertyName("collections")]
    public ApiObnoxiousHref CollectionsLink { get; set; }

    [JsonPropertyName("equipment")]
    public ApiObnoxiousHref EquipmentLink { get; set; }

    [JsonPropertyName("media")]
    public ApiObnoxiousHref MediaLink { get; set; }

    [JsonPropertyName("mythic_keystone_profile")]
    public ApiObnoxiousHref MythicKeystoneProfileLink { get; set; }

    [JsonPropertyName("professions")]
    public ApiObnoxiousHref ProfessionsLink { get; set; }

    [JsonPropertyName("quests")]
    public ApiObnoxiousHref QuestsLink { get; set; }

    [JsonPropertyName("reputations")]
    public ApiObnoxiousHref ReputationsLink { get; set; }

    [JsonPropertyName("specializations")]
    public ApiObnoxiousHref SpecializationsLink { get; set; }

    [JsonPropertyName("statistics")]
    public ApiObnoxiousHref StatisticsLink { get; set; }

    [JsonPropertyName("titles")]
    public ApiObnoxiousHref TitlesLink { get; set; }
}

public class ApiCharacterCovenantProgress
{
    [JsonPropertyName("chosen_covenant")]
    public ApiObnoxiousObject ChosenCovenant { get; set; }

    [JsonPropertyName("soulbinds")]
    public ApiObnoxiousHref SoulbindsLink { get; set; }
}
