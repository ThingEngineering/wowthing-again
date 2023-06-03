using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

public class PlayerAccount
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("User")]
    public long? UserId { get; set; }
    public ApplicationUser User { get; set; }

    public WowRegion Region { get; set; }
    public long AccountId { get; set; }

    public string Tag { get; set; }
    public bool Enabled { get; set; } = true;

    // Navigation properties
    public PlayerAccountAddonData AddonData { get; set; }
    public List<PlayerCharacter> Characters { get; set; }
    public PlayerAccountHeirlooms Heirlooms { get; set; }
    public PlayerAccountPets Pets { get; set; }
    public PlayerAccountToys Toys { get; set; }
    public PlayerAccountTransmogSources TransmogSources { get; set; }
}
