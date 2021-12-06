using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow
{
    public class WowItem
    {
        [Key]
        public int Id { get; set; }
        public int ClassMask { get; set; }
        public long RaceMask { get; set; }
        public int Stackable { get; set; }
        public short ClassId { get; set; }
        public short SubclassId { get; set; }
        public short InventoryType { get; set; }
        public short ContainerSlots { get; set; }
        public WowQuality Quality { get; set; }
    }
}
