using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

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

    public DateTime ExpiresAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime ReportedAt { get; set; } = MiscConstants.DefaultDateTime;

    // 4 bytes
    public int ZoneId { get; set; }
    public int QuestId { get; set; }

    // 2 bytes
    public short Region { get; set; }
    public short Expansion { get; set; }
    public short Faction { get; set; }
    public short Class { get; set; }

    // variable
    public string Location { get; set; }

    [Column(TypeName = "jsonb")]
    public List<int[]> Rewards { get; set; }
}
