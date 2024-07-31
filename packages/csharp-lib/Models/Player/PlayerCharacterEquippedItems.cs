using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterEquippedItems
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<WowInventorySlot, PlayerCharacterEquippedItem> Items { get; set; }
}

public class PlayerCharacterEquippedItem
{
    public int Context { get; set; }
    public int CraftedQuality { get; set; }
    public int ItemId { get; set; }
    public int ItemLevel { get; set; }
    public WowQuality Quality { get; set; }

    public List<int> BonusIds { get; set; }
    public List<int> EnchantmentIds { get; set; }
    public List<int> GemIds { get; set; }
    public Dictionary<int, int> Modifiers { get; set; }
}
