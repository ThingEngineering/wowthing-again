using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticMountConverter))]
public class StaticMount : WowMount
{
    public string Name { get; set; }

    public StaticMount(WowMount mount) : base(mount.Id)
    {
        Flags = mount.Flags;
        ItemId = mount.ItemId;
        SpellId = mount.SpellId;
        SourceType = mount.SourceType;
    }
}
