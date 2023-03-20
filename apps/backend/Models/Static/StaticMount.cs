using Wowthing.Backend.Converters.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

[System.Text.Json.Serialization.JsonConverter(typeof(StaticMountConverter))]
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
