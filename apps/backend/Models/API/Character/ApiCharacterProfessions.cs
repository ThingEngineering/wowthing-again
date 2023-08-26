using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterProfessions
{
    public List<ApiCharacterProfessionsProfession> Primaries { get; set; }
    public List<ApiCharacterProfessionsProfession> Secondaries { get; set; }

    public IEnumerable<ApiCharacterProfessionsProfession> All => Primaries.EmptyIfNull()
        .Concat(Secondaries.EmptyIfNull());
}

public class ApiCharacterProfessionsProfession
{
    public ApiObnoxiousObject Profession { get; set; }

    [JsonProperty("max_skill_points")]
    [JsonPropertyName("max_skill_points")]
    public int? MaxSkillPoints { get; set; }

    [JsonProperty("skill_points")]
    [JsonPropertyName("skill_points")]
    public int? SkillPoints { get; set; }

    public ApiObnoxiousObject Specialization { get; set; }

    public List<ApiCharacterProfessionsProfessionTier> Tiers { get; set; }
}

public class ApiCharacterProfessionsProfessionTier
{
    public ApiObnoxiousObject Tier { get; set; }

    [JsonProperty("max_skill_points")]
    [JsonPropertyName("max_skill_points")]
    public int MaxSkillPoints { get; set; }

    [JsonProperty("skill_points")]
    [JsonPropertyName("skill_points")]
    public int SkillPoints { get; set; }

    [JsonProperty("known_recipes")]
    [JsonPropertyName("known_recipes")]
    public List<ApiObnoxiousObject> KnownRecipes { get; set; }
}
