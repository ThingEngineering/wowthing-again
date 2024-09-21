namespace Wowthing.Tool.Models.Professions;

// ReSharper disable InconsistentNaming
public class DumpModifiedCraftingSpellSlot
{
    public short ModifiedCraftingReagentSlotID { get; set; }
    public short ReagentCount { get; set; }
    public short ReagentReCraftCount { get; set; }
    public short Slot { get; set; }
    public int SpellID { get; set; }
}
