using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterAddonAchievements
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public DateTime ScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterAddonAchievementsAchievement> Achievements { get; set; }

    public PlayerCharacterAddonAchievements(PlayerCharacter character)
    {
        CharacterId = character.Id;
    }
}

public class PlayerCharacterAddonAchievementsAchievement
{
    public bool Earned { get; set; }
    public List<int> Criteria { get; set; }
}
