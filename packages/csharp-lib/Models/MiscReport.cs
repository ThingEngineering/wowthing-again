using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models;

[Index(nameof(UserId))]
[Index(nameof(ReportType), nameof(Region), nameof(ExpiresAt), IsDescending = [false, false, true])]
public class MiscReport
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

    // 2 bytes
    public MiscReportType ReportType { get; set; }
    public short Region { get; set; }

    // variable
    [MaxLength(1024)]
    public string Data { get; set; }
}
