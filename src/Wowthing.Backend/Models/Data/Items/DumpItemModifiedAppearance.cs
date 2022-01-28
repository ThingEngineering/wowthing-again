// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Items
{
    public class DumpItemModifiedAppearance
    {
        public int ID { get; set; }
        public int ItemID { get; set; }
        public int ItemAppearanceID { get; set; }
        public short ItemAppearanceModifierID { get; set; }
    }
}
