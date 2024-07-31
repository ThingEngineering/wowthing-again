using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models.Wow;

[JsonConverter(typeof(WowItemBonusConverter))]
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
