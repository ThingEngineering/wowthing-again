using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerAccountGoldSnapshot : IGoldSnapshot
{
    public long Id { get; set; }

    public DateTime Time { get; set; }

    [ForeignKey("Account")]
    public int AccountId { get; set; }
    public PlayerAccount Account { get; set; }

    public int RealmId { get; set; }
    public int Gold { get; set; }
}
