using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models;

[Index(nameof(UserId))]
[Index(nameof(Region), nameof(ExpiresAt), IsDescending = new[] { false, true })]
public class WorldQuestReport
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    // 8 bytes
    [ForeignKey("User")]
    public long UserId { get; set; }
    public ApplicationUser User { get; set; }

    public DateTime ExpiresAt { get; set; }

    // 4 bytes
    public int ZoneId { get; set; }
    public int QuestId { get; set; }

    // 2 bytes
    public short Region { get; set; }
    public short Expansion { get; set; }
    public short Faction { get; set; }
    public short Class { get; set; }

    // blob
    [Column(TypeName = "jsonb")]
    public List<WorldQuestReportReward> Rewards { get; set; }
}

public class WorldQuestReportReward
{
    public RewardType Type { get; set; }
    public int Id { get; set; }
    public int Amount { get; set; }
}
