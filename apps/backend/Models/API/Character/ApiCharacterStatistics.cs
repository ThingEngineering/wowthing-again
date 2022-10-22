using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Newtonsoft.Json.Serialization;

namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterStatistics
{
    public List<ApiCharacterStatisticsCategory> Categories { get; set; }
}

public class ApiCharacterStatisticsCategory
{
    public int Id { get; set; }

    [JsonProperty("sub_categories")]
    [JsonPropertyName("sub_categories")]
    public List<ApiCharacterStatisticsCategory> SubCategories { get; set; }

    public List<ApiCharacterStatisticsStatistic> Statistics { get; set; }
}

public class ApiCharacterStatisticsStatistic
{
    public int Id { get; set; }
    public double Quantity { get; set; }
    public string Description { get; set; }
}
