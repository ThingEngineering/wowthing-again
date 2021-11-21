using System.ComponentModel.DataAnnotations;

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
    }
}
