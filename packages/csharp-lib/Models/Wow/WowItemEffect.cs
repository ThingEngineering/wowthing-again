using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowItemEffect
{
    [Key]
    public int ItemXItemEffectId { get; set; }

    public int ItemId { get; set; }
    public WowSpellEffectEffect Effect { get; set; }
    public int[] Values { get; set; }
}
