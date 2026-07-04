using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterQuests
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public DateTime ScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    // Deprecated at this point
    public List<int> CompletedIds { get; set; }
    // RoaringBitmap compressed data
    public byte[] CompressedCompletedIds { get; set; }

    [NotMapped]
    public List<int> UsableCompletedIds => CompressedCompletedIds != null
        ? SerializationUtilities.DeserializeFromBitmap(CompressedCompletedIds)
        : CompletedIds;
}
