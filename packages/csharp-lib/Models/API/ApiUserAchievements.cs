using Newtonsoft.Json.Linq;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Lib.Models.API;

public class ApiUserAchievements
{
    public Dictionary<int, int> Achievements { get; set; }
    public Dictionary<int, Dictionary<int, PlayerCharacterAddonAchievementsAchievement>> AddonAchievements { get; set; }
    public Dictionary<int, StatisticsQuery[]> Statistics { get; set; }

    public JArray RawCriteria { get; set; }
}
