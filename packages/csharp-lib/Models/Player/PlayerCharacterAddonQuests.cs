using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterAddonQuests(int characterId)
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; } = characterId;

    public PlayerCharacter Character { get; set; }

    public DateTime CallingsScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime CompletedQuestsScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime QuestsScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime WorldQuestsScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    public List<int> CompletedQuests { get; set; }
    // RoaringBitmap compressed data
    public byte[] CompressedCompletedIds { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, List<List<int>>> Dailies { get; set; }

    // [ questId, expiry, gold ]
    [Column(TypeName = "jsonb")]
    public List<List<int>> GoldWorldQuests { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<string, PlayerCharacterAddonQuestsProgress> ProgressQuests { get; set; }

    [NotMapped]
    public List<int> UsableCompletedIds => CompressedCompletedIds != null
        ? SerializationUtilities.DeserializeFromBitmap(CompressedCompletedIds)
        : CompletedQuests;
}

public class PlayerCharacterAddonQuestsProgress
{
    public int Expires { get; set; }
    public int Id { get; set; }
    public int Status { get; set; }
    public string Name { get; set; }

    public List<PlayerCharacterAddonQuestsProgressObjective> Objectives { get; set; } = new();
}

public class PlayerCharacterAddonQuestsProgressObjective
{
    public int Have { get; set; }
    public int Need { get; set; }
    public string Text { get; set; }
    public string Type { get; set; }
}
