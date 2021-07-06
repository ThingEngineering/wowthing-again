using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterCurrencies
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.MinValue;

        [Column(TypeName = "jsonb")]
        public Dictionary<int, PlayerCharacterCurrenciesCurrency> Currencies { get; set; }
    }

    public class PlayerCharacterCurrenciesCurrency
    {
        public int Total { get; set; }
        public int TotalMax { get; set; }
        public int Week { get; set; }
        public int WeekMax { get; set; }
    }
}
