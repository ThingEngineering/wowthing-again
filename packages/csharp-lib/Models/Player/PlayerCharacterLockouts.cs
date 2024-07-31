using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterLockouts(int characterId)
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; } = characterId;

    public PlayerCharacter Character { get; set; }

    public DateTime LastUpdated { get; set; } = MiscConstants.DefaultDateTime;

    [Column(TypeName = "jsonb")]
    public List<PlayerCharacterLockoutsLockout> Lockouts { get; set; }
}

public class PlayerCharacterLockoutsLockout
{
    public bool Locked { get; set; }
    public int DefeatedBosses { get; set; }
    public int Difficulty { get; set; }
    public int Id { get; set; }
    public int MaxBosses { get; set; }
    public string Name { get; set; }
    public DateTime ResetTime { get; set; }
    public List<PlayerCharacterLockoutsLockoutBoss> Bosses { get; set; }

    public bool Equals(PlayerCharacterLockoutsLockout other)
    {
        if (ReferenceEquals(null, other))
        {
            return false;
        }

        if (ReferenceEquals(this, other))
        {
            return true;
        }

        return DefeatedBosses == other.DefeatedBosses &&
               Difficulty == other.Difficulty &&
               Id == other.Id &&
               Locked == other.Locked &&
               MaxBosses == other.MaxBosses &&
               Name == other.Name &&
               ResetTime.Equals(other.ResetTime);
    }
}

public class PlayerCharacterLockoutsLockoutBoss
{
    public bool Dead { get; set; }
    public string Name { get; set; }
}
