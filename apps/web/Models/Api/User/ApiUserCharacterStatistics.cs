using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Web.Converters;

namespace Wowthing.Web.Models.Api.User;

[System.Text.Json.Serialization.JsonConverter(typeof(ApiUserCharacterStatisticsConverter))]
public class ApiUserCharacterStatistics
{
    public Dictionary<WowItemStatType, PlayerCharacterStatsBasic> Basic { get; set; }
    public Dictionary<WowItemStatType, int> Misc { get; set; }
    public Dictionary<WowItemStatType, PlayerCharacterStatsRating> Rating { get; set; }

    public ApiUserCharacterStatistics(PlayerCharacterStats pcStats)
    {
        Basic = pcStats.Basic;
        Misc = pcStats.Misc;
        Rating = pcStats.Rating;
    }
}
