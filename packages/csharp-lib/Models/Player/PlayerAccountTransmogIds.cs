using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerAccountTransmogIds
{
    [Key, ForeignKey("Account")]
    public int AccountId { get; set; }
    public PlayerAccount Account { get; set; }

    public List<int> Ids { get; set; }
}
