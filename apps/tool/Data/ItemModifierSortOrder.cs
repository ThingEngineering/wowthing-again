namespace Wowthing.Tool.Data;

public partial class Hardcoded
{
    public static readonly Dictionary<int, int> ItemModifierSortOrder = new()
    {
        { 156, -41 }, // Mythic Fancy
        { 3, -40 }, // Mythic
        { 155, -31 }, // Heroic Fancy
        { 1, -30 }, // Heroic
        { 154, -21 }, // Normal Fancy
        { 0, -20 }, // Normal
        { 153, -11 }, // LFR Fancy
        { 4, -10 }, // LFR
    };
}
