using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticChallengeDungeonConverter))]
public class StaticChallengeDungeon : WowChallengeDungeon
{
    public string Name { get; set; } = String.Empty;

    public StaticChallengeDungeon(WowChallengeDungeon dbDungeon) : base(dbDungeon.Id)
    {
        Expansion = dbDungeon.Expansion;
        MapId = dbDungeon.MapId;
        TimerBreakpoints = dbDungeon.TimerBreakpoints;
    }
}
