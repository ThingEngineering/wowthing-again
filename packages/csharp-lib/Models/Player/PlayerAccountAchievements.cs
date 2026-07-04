using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerAccountAchievements
{
    [Key, ForeignKey("Account")]
    public int AccountId { get; set; }
    public PlayerAccount Account { get; set; }

    public byte[] CompressedAchievementIds { get; set; }
    public List<int> AchievementTimestamps { get; set; }
}
