namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    // SPELL IDS
    public static readonly HashSet<int> IgnoredSkillLineAbilities = new()
    {
        // Alchemy
        28577, // Major Holy Protection Potion
        156567, // Draenor Armor Flask
        370771, // Dragon Isles Alchemy Troubleshooting Test Recipe (DNT)
        371635, // Demonstration Item Recipe

        // Blacksmithing
        8368, // Ironforge Gauntlets
        9942, // Mithril Scale Gloves
        16960, // Thorium Greatsword
        16967, // Inlaid Thorium Hammer
        16980, // Rune Edge
        16986, // Blood Talon
        409224, // Reclaimed Gauntlet Chassis (temporary legendary craft)

        // Blacksmithing - Draenic Steel
        153605,
        153606,
        153607,
        153608,
        153609,
        153610,
        153611,
        153612,
        153627,
        153628,
        153629,
        153630,
        153631,
        153643,
        153644,
        153645,
        153646,
        153647,
        153648,
        153649,
        153650,
        153651,
        153652,
        153653,
        153654,
        153655,
        153656,
        153657,
        153658,
        153659,
        153660,
        153661,
        153663,
        153664,
        153665,
        153666,
        153667,
        153668,

        // Cooking
        145167, // Grand Noodle Cart Kit
        145170, // Grand Deluxe Noodle Cart Kit
        145197, // Grand Pandaren Treasure Noodle Cart Kit
        169693, // Whole Pot-Roasted Elekk
        169696, // Marinated Elekk Steak
        169699, // Seasoned Elekk Ribeye

        // Engineering
        12900, // Mobile Alarm
        407170, // Inspired Order Recalibrator (temporary legendary craft)

        // Jewelcrafting
        25614, // Silver Rose Pendant
        407161, // Immaculate Coalescing Dracothyst (temporary legendary craft)

        // Mining
        389465, // Severite Seam
        389458, // Draconium Seam
    };
}
