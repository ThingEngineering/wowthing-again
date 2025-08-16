namespace Wowthing.Backend.Models.API.Data;

public class ApiDataQuest
{
    public int Id { get; set; }
    public string Title { get; set; }

    public ApiObnoxiousObject Area { get; set; }
    public ApiObnoxiousObject Category { get; set; }
    public ApiDataQuestRequirements Requirements { get; set; }
}

public class ApiDataQuestRequirements
{
    [JsonPropertyName("min_character_level")]
    public short MinCharacterLevel { get; set; }

    [JsonPropertyName("max_character_level")]
    public short MaxCharacterLevel { get; set; }
}
