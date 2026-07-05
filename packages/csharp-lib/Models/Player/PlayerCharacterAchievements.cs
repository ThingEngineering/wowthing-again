using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterAchievements
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public byte[] CompressedCriteriaIds { get; set; }
    public List<int> CriteriaIds { get; set; }
    public List<long> CriteriaAmounts { get; set; }
    public List<bool> CriteriaCompleted { get; set; }

    [NotMapped]
    public List<int> UsableCriteriaIds => CompressedCriteriaIds != null
        ? SerializationUtilities.DeserializeFromBitmap(CompressedCriteriaIds)
        : CriteriaIds;
}
