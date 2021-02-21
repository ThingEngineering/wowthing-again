using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
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
        public int ItemId { get; set; }
        public int ItemLevel { get; set; }
        public WowQuality Quality { get; set; }

        public List<int> BonusIds { get; set; }
        public List<int> EnchantmentIds { get; set; }
    }
}
