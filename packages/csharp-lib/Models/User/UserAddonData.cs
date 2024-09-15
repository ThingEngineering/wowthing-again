using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.User;

public class UserAddonData(long userId)
{
    [Key, ForeignKey("User")]
    public long UserId { get; set; } = userId;

    public ApplicationUser User { get; set; }

    public DateTimeOffset WarbankUpdatedAt { get; set; }
    public DateTimeOffset WarbankGoldUpdatedAt { get; set; }

    public long WarbankCopper { get; set; }
}
