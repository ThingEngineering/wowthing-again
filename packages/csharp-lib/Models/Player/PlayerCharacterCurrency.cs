using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    [Index(nameof(CharacterId), nameof(CurrencyId))]
    public class PlayerCharacterCurrency
    {
        // Fields are ordered from largest to smallest for database table size reasons.
        [ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public int Quantity { get; set; }
        public int Max { get; set; }
        public int WeekQuantity { get; set; }
        public int WeekMax { get; set; }
        public int TotalQuantity { get; set; }

        public short CurrencyId { get; set; }

        public bool IsWeekly { get; set; }
        public bool IsMovingMax { get; set; }
    }
}
