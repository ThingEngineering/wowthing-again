using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

public class StaticCharacterRace : WowCharacterRace
{
    public string Name { get; set; }
    public string Slug { get; set; }

    public StaticCharacterRace(WowCharacterRace dbRace)
    {
        Id = dbRace.Id;
        Faction = dbRace.Faction;
    }
}
