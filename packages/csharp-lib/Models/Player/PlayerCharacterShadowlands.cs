using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterShadowlands
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    // Covenants
    public int CovenantId { get; set; }
    public int RenownLevel { get; set; }
    public int SoulbindId { get; set; }
    public List<int> ConduitIds { get; set; }
    public List<int> ConduitRanks { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterShadowlandsCovenant> Covenants { get; set; }

    public PlayerCharacterShadowlands(PlayerCharacter character)
    {
        CharacterId = character.Id;
    }
}

public class PlayerCharacterShadowlandsCovenant
{
    public int Anima { get; set; }
    public int Renown { get; set; }
    public int Souls { get; set; }
    public PlayerCharacterShadowlandsCovenantFeature Conductor { get; set; }
    public PlayerCharacterShadowlandsCovenantFeature Missions { get; set; }
    public PlayerCharacterShadowlandsCovenantFeature Transport { get; set; }
    public PlayerCharacterShadowlandsCovenantFeature Unique { get; set; }
    public List<PlayerCharacterShadowlandsCovenantSoulbind> Soulbinds { get; set; }
}

public class PlayerCharacterShadowlandsCovenantFeature
{
    public int Rank { get; set; }
    public int? ResearchEnds { get; set; }
    public string Name { get; set; }
}

public class PlayerCharacterShadowlandsCovenantSoulbind
{
    public int Id { get; set; }

    public bool Unlocked { get; set; }
    public List<int> Specializations { get; set; }
    public List<List<int>> Tree { get; set; }
}
