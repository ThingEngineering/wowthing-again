using Wowthing.Lib.Models.Wow;

namespace Wowthing.Tool.Models.Static;

public class StaticCharacterRace : WowCharacterRace
{
    public string Name { get; set; }
    public string Slug { get; set; }

    public StaticCharacterRace(WowCharacterRace dbRace) : base(dbRace.Id)
    {
        Bit = dbRace.Bit;
        Faction = dbRace.Faction;
    }
}
