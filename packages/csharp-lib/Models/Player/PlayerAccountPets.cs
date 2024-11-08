using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

public class PlayerAccountPets
{
    [Key, ForeignKey("Account")]
    public int AccountId { get; set; }
    public PlayerAccount Account { get; set; }

    public DateTime UpdatedAt { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<long, PlayerAccountPetsPet> Pets { get; set; } = new();

    public PlayerAccountPets(int accountId)
    {
        AccountId = accountId;
    }
}

public class PlayerAccountPetsPet
{
    public bool FromAddon { get; set; }
    public int BreedId { get; set; }
    public int Level { get; set; }
    public int SpeciesId { get; set; }
    public WowQuality Quality { get; set; }
}
