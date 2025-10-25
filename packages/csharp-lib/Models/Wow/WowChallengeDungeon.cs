using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Data;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowChallengeDungeon
{
    [Key]
    public short Id { get; set; }

    public short Expansion { get; set; }
    public short MapId { get; set; }

    public List<short> TimerBreakpoints { get; set; } = new();

    public WowChallengeDungeon(short id)
    {
        Id = id;
    }
}
