using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Appearances;
using Wowthing.Tool.Models.Items;

namespace Wowthing.Tool.Models.Appearances;

[JsonConverter(typeof(RedisAppearanceDataConverter))]
public class RedisAppearanceData
{
    public DumpItemAppearance? Appearance { get; set; }
    public List<(WowItemModifiedAppearance, WowQuality)> ModifiedAppearances { get; set; } = new();
}
