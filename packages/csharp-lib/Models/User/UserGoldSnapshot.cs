using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.User;

public class UserGoldSnapshot
{
    public long Id { get; set; }

    [ForeignKey("User")]
    public long? UserId { get; set; }
    public ApplicationUser User { get; set; }

    public DateTime Time { get; set; }

    public int Gold { get; set; }
}
