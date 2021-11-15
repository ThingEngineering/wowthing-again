using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterItems
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }
       
        [Column(TypeName = "jsonb")]
        public List<PlayerCharacterItem> Items { get; set; }
    }

    public class PlayerCharacterItem
    {
        public ItemLocation Location { get; set; }
        public int ItemId { get; set; }
        public int Count { get; set; }
    }
}
