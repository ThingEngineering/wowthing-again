using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterAchievementStatistics
{
    public List<ApiCharacterAchievementStatisticsCategory> Categories { get; set; }
}

public class ApiCharacterAchievementStatisticsCategory
{
    public int Id { get; set; }

    [JsonProperty("sub_categories")]
    [JsonPropertyName("sub_categories")]
    public List<ApiCharacterAchievementStatisticsCategory> SubCategories { get; set; }

    public List<ApiCharacterAchievementStatisticsStatistic> Statistics { get; set; }
}

public class ApiCharacterAchievementStatisticsStatistic
{
    public int Id { get; set; }
    public double Quantity { get; set; }
    public string Description { get; set; }
}
