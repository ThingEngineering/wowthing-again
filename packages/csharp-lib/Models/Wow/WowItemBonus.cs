using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models.Wow;

[System.Text.Json.Serialization.JsonConverter(typeof(WowItemBonusConverter))]
public class WowItemBonus
{
    public long BonusTypeFlags { get; set; }
    public int Id { get; set; }

    [Column(TypeName = "jsonb")]
    public List<List<int>> Bonuses { get; set; }

    public WowItemBonus(int id)
    {
        Id = id;
    }
}
