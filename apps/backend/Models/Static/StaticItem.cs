using Wowthing.Backend.Converters.Static;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

[JsonConverter(typeof(StaticItemConverter))]
public class StaticItem
{
    public Dictionary<short, int> AppearanceIds { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public WowQuality Quality { get; set; }

    public StaticItem(WowItem item)
    {
        Id = item.Id;
        Quality = item.Quality;
    }
}
