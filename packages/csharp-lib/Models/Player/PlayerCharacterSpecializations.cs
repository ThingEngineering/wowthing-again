using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterSpecializations
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterSpecializationsSpecialization> Specializations { get; set; }
}

public class PlayerCharacterSpecializationsSpecialization
{
    public List<PlayerCharacterSpecializationsSpecializationLoadout> Loadouts { get; set; } = new();
    public List<List<int>> PvpTalents { get; set; } = new();
    // public List<List<int>> Talents { get; set; } = new();
}

public class PlayerCharacterSpecializationsSpecializationLoadout
{
    public bool Active { get; set; }
    public int HeroTreeId { get; set; }
    public string LoadoutCode { get; set; }

    public List<List<int>> Talents { get; set; } = new();
}
