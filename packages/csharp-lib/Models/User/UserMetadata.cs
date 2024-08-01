using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.User;

public class UserMetadata(long userId)
{
    [Key, ForeignKey("User")]
    public long UserId { get; set; } = userId;

    public ApplicationUser User { get; set; }

    public DateTimeOffset WarbankUpdatedAt { get; set; }
}
