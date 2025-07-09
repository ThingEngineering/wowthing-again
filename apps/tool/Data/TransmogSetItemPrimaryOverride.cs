namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    // TransmogSetItemID, Flags
    public static Dictionary<int, int> TransmogSetItemPrimaryOverride = new()
    {
        // Dragonflight - Vault - 2622 Druid
        { 51699, 0x0 }, // 195525 (wrong wrists)
        { 51700, 0x1 }, // 200358 (correct wrists)
        // Dragonflight - Aberrus - Priest
        { 56997, 0x0 }, // Crucible Curator's Wingspan (wrong shoulders)
        { 56998, 0x1 }, // Devotion of the Furnace Seraph (correct shoulders)
        // Dragonflight - Aberrus - 2884 Priest
        { 56978, 0x0 }, // 204393 (wrong wrists)
        { 56977, 0x1 }, // 202538 (correct wrists)
        // Dragonflight - Amirdrassil - Mage
        { 60109, 0x0 }, // 208431 Lost Scholar's Temporal Shoulderdials (wrong shoulders)
        { 60108, 0x1 }, // 207288 Wayward Chronomancer's Metronomes (correct shoulders)
        // Dragonflight - Amirdrassil - ?
        { 60167, 0x0 }, // 208430 (wrong belt)
        { 60166, 0x1 }, // 207269 (correct belt)
        // The War Within - Nerub-ar Palace - Druid LFR
        { 67853, 0x0 }, // Venom Stalker's Strap (wrong belt)
        { 67852, 0x1 }, // Faulds of the Greatlynx (correct belt)
        // The War Within - Liberation of Undermine - Rogue Normal
        { 73806, 0x0 }, // Hitman's Holster (wrong belt)
        { 73807, 0x1 }, // Spectral Gambler's ? (correct belt)
    };
}
