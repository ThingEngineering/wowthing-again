using Wowthing.Backend.Converters.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

[JsonConverter(typeof(StaticItemConverter))]
public class StaticItem
{
    public int Id { get; set; }

    public int AppearanceId { get; set; }
    public string Name { get; set; }

    public StaticItem(WowItem item)
    {
        Id = item.Id;
    }
}
