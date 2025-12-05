using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Player;

public class PlayerAccountAddonData
{
    [Key, ForeignKey("Account")]
    public int AccountId { get; set; }
    public PlayerAccount Account { get; set; }

    public short HonorCurrent { get; set; }
    public short HonorLevel { get; set; }
    public short HonorMax { get; set; }

    public DateTime DecorScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    [Column(TypeName = "jsonb")]
    public Dictionary<int, List<int>> Decor { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, short> Heirlooms { get; set; }

    public List<int> Illusions { get; set; }
    public List<int> Quests { get; set; }
}
