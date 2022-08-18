using Wowthing.Backend.Converters;
using Wowthing.Backend.Models.Data.Items;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Redis;

public class RedisStaticAppearances
{
    [JsonProperty("rawAppearances")]
    public Dictionary<string, List<RedisStaticAppearanceData>> Appearances { get; set; } = new();
}

[JsonConverter(typeof(RedisStaticAppearanceDataConverter))]
public class RedisStaticAppearanceData
{
    public DumpItemAppearance Appearance { get; set; }
    public List<(WowItemModifiedAppearance, WowQuality)> ModifiedAppearances { get; set; } = new();
}
