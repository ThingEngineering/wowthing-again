using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Wow;

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
