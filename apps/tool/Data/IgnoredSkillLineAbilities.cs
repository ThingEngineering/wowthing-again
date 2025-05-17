namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly HashSet<int> IgnoredSkillLineAbilities =
    [
        // Magical Intrusion Dampener weirdness
        39964,
        39965,
        39966,
        41059,
        41060,
        41061,
        46628,
        46629,
        46630,
    ];

    public static readonly HashSet<int> IgnoredSkillLineAbilitySpells =
    [
        // Alchemy
        17579, // Greater Holy Protection Potion
        28577, // Major Holy Protection Potion
        54020, // Transmute: Eternal Might
        156567, // WoD Draenor Armor Flask (never implemented)
        156588, // WoD Alchemical Catalyst - Fireweed
        156589, // WoD Alchemical Catalyst - Flytrap
        156590, // WoD Alchemical Catalyst - Starflower
        156591, // WoD Primal Alchemy (never implemented)
        156592, // WoD Alchemical Catalyst - Orchid
        156593, // WoD Alchemical Catalyst - Lotus
        168042, // WoD Alchemical Catalyst (dupe for max results?)
        370771, // Dragon Isles Alchemy Troubleshooting Test Recipe (DNT)
        371635, // Demonstration Item Recipe
        430606, // TWW ??
        433271, // TWW ??
        433604, // TWW ??
        433605, // TWW ??
        433606, // TWW ??
        433607, // TWW ??
        433608, // TWW ??
        430610, // TWW ??

        // Blacksmithing
        2671, // Rough Bronze Bracers
        8366, // Ironforge Chain
        8368, // Ironforge Gauntlets
        9942, // Mithril Scale Gloves
        9957, // Orcish War Leggings
        9972, // Ornate Mithril Breastplate
        9979, // Ornate Mithril Boots
        9980, // Ornate Mithril Helm
        16960, // Thorium Greatsword
        16965, // Bleakwood Hew
        16967, // Inlaid Thorium Hammer
        16980, // Rune Edge
        16986, // Blood Talon
        16987, // Darkspear
        34529, // Nether Chain Shirt
        34530, // TBC Twisting Nether Chain Shirt
        55186, // WotLK Chestplate of Conquest
        55187, // WotLK Legplates of Conquest
        409224, // Reclaimed Gauntlet Chassis (temporary legendary craft)

        // Blacksmithing - MoP Spiritguard
        122568, // Helm
        122569, // Shoulders
        122570, // Breastplate
        122571, // Gauntlets
        122572, // Legplates
        122573, // Bracers
        122574, // Boots
        122575, // Belt

        // Blacksmithing - MoP Lightsteel
        122584, // Helm
        122585, // Shoulders
        122586, // Breastplate
        122587, // Gauntlets
        122588, // Legplates
        122589, // Bracers
        122590, // Boots
        122591, // Belt

        // Blacksmithing - MoP Masterwork Lightsteel
        122608, // Helm
        122609, // Shoulders
        122610, // Breastplate
        122611, // Gauntlets
        122612, // Legplates
        122613, // Bracers
        122614, // Boots
        122615, // Belt

        // Blacksmithing - MoP ??
        122600,
        122601,
        122602,
        122603,
        122604,
        122605,
        122606,
        122607,

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

        // Enchanting
        44612, // WotLK Greater Blasting
        343681, // Shadowlands ??
        422338, // Shalasar's Sophic Vellum (temporary legendary craft)

        // Engineering
        12900, // Mobile Alarm
        30342, // TBC Red Smoke Flare
        30343, // TBC Blue Smoke Flare
        162208, // Ultimate Gnomish Army Knife (dupe for BoE?)
        178242, // Gearspring Parts (dupe for max results?)
        407170, // Inspired Order Recalibrator (temporary legendary craft)

        // Inscription
        130407, // MoP Mystery of the Mists
        176513, // WoD Draenor Merchant Order
        178550, // WoD Borrow Draenic Mortar
        343687, // Shadowlands ??
        422337, // Lydaria's Binding Rune (temporary legendary craft)

        // Jewelcrafting
        25614, // Silver Rose Pendant
        407161, // Immaculate Coalescing Dracothyst (temporary legendary craft)

        // Leatherworking
        10550, // Nightscape Cloak
        19106, // Onyxia Scale Breastplate
        102366, // Mist-Touched Leather (combining 5 pieces?)
        171713, // Burnished Leather (dupe for max results?)
        173416, // Small Football (never implemented?)
        422330, // Erden's Glowspore Grip (temporary legendary craft)

        // Mining
        // 389465, // Severite Seam
        // 389458, // Draconium Seam
        423882, // Overload Test Deposit

        // Tailoring
        7636, // Green Woolen Robe
        8778, // Boots of Darkness
        12062, // Stormcloth Pants
        12063, // Stormcloth Gloves
        12068, // Stormcloth Vest
        12083, // Stormcloth Headband
        12087, // Stormcloth Shoulders
        12090, // Stormcloth Boots
        36665, // Pattern: Netherflame Robe
        36667, // Pattern: Netherflame Belt
        36668, // Pattern: Netherflame Boots
        36669, // Pattern: Lifeblood Leggings
        36670, // Pattern: Lifeblood Belt
        36672, // Pattern: Lifeblood Bracers

        104115, // MoP Release Fire Spirit
        168851, // Miniature Flying Carpet (never implemented)
        169669, // Hexweave Cloth (dupe for max results?)
        173415, // WoD ??
        176313, // [A] Inspiring Battle Standard (garrison building craft)
        176314, // [A] Fearsome Battle Standard (garrison building craft)
        176315, // [H] Inspiring Battle Standard (garrison building craft)
        176316, // [H] Fearsome Battle Standard (garrison building craft)

        // Tailoring ranks?
        3908,
        3909,
        3910,
        12180,
        26790,
        51309,
        75156,
        110426,
        158758,
        195126
    ];
}
