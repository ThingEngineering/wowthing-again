using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.User;

public class UserCache
{
    [Key, ForeignKey("User")]
    public long UserId { get; set; }
    public ApplicationUser User { get; set; }

    // Transmog
    public DateTimeOffset TransmogUpdated { get; set; }
    public List<int> AppearanceIds { get; set; }
    public List<string> AppearanceSources { get; set; }
    public List<short> IllusionIds { get; set; }

    // Mounts
    public DateTimeOffset MountsUpdated { get; set; }
    public List<short> MountIds { get; set; }

    // Toys
    public DateTimeOffset ToysUpdated { get; set; }
    public List<short> ToyIds { get; set; }

    // Misc
    public int CompletedQuests { get; set; }

    public UserCache(long userId)
    {
        UserId = userId;
    }
}
