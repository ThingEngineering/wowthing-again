using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticToyConverter))]
public class StaticToy : WowToy
{
    public string Name { get; set; }

    public StaticToy(WowToy toy) : base(toy.Id)
    {
        Flags = toy.Flags;
        ItemId = toy.ItemId;
        SourceType = toy.SourceType;
    }
}
