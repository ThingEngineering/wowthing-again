using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowItemEffectV2
{
    [Key]
    public int ItemId { get; set; }

    public List<int> ItemEffectIds { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, Dictionary<int, WowItemEffectV2SpellEffect>> SpellEffects { get; set; } = new();
}

public class WowItemEffectV2SpellEffect
{
    public WowSpellEffectEffect Effect { get; set; }
    public int[] Values { get; set; }
}
