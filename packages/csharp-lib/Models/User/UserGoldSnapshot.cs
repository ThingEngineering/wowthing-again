using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.User;

public class UserGoldSnapshot : IGoldSnapshot
{
    public long Id { get; set; }

    [ForeignKey("User")]
    public long? UserId { get; set; }
    public ApplicationUser User { get; set; }

    public DateTime Time { get; set; }

    public int Gold { get; set; }

    // IGoldSnapshot
    public int AccountId => 0;
    public int RealmId => 0;
}
