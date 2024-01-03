using System.Text.Json.Serialization;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Lib.Models.API;

public class ApiUserAchievements
{
    public Dictionary<int, int> Achievements { get; set; }
    public Dictionary<int, Dictionary<int, PlayerCharacterAddonAchievementsAchievement>> AddonAchievements { get; set; }
    public Dictionary<int, StatisticsQuery[]> Statistics { get; set; }

    [JsonConverter(typeof(RawCriteriaConverter))]
    public Dictionary<int, Dictionary<int, List<int>>> RawCriteria { get; set; }
}
