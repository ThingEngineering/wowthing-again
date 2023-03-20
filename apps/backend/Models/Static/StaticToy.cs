using Wowthing.Backend.Converters.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

[System.Text.Json.Serialization.JsonConverter(typeof(StaticToyConverter))]
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
