using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.User;

public class UserCache
{
    [Key, ForeignKey("User")]
    public long UserId { get; set; }
    public ApplicationUser User { get; set; }

    public List<int> AppearanceIds { get; set; }
    public List<string> AppearanceSources { get; set; }

    public UserCache(long userId)
    {
        UserId = userId;
    }
}
