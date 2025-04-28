namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    // TransmogSetItemID, Flags
    public static Dictionary<int, int> TransmogSetItemPrimaryOverride = new()
    {
        // Dragonflight - Aberrus - Priest LFR
        { 56997, 0x0 }, // Crucible Curator's Wingspan (wrong shoulders)
        { 56998, 0x1 }, // Devotion of the Furnace Seraph (correct shoulders)
        // The War Within - Nerub-ar Palace - Druid LFR
        { 67853, 0x0 }, // Venom Stalker's Strap (wrong belt)
        { 67852, 0x1 }, // Faulds of the Greatlynx (correct belt)
        // The War Within - Liberation of Undermine - Rogue Normal
        { 73806, 0x0 }, // Hitman's Holster (wrong belt)
        { 73807, 0x1 }, // Spectral Gambler's ? (correct belt)
    };
}
