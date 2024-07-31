using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowCharacterRace
{
    [Key]
    public short Id { get; set; }

    public WowFaction Faction { get; set; }
    public short Bit { get; set; }

    public WowCharacterRace(short id)
    {
        Id = id;
    }
}
