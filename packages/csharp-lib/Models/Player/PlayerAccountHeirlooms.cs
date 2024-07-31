using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerAccountHeirlooms
{
    [Key, ForeignKey("Account")]
    public int AccountId { get; set; }
    public PlayerAccount Account { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, int> Heirlooms { get; set; }
}
