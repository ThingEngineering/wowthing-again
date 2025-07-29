namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    private static readonly int[] DungeonDifficultiesNormal = [1];
    private static readonly int[] DungeonDifficultiesNormalHeroicMythic = [1, 2, 8];
    private static readonly int[] DungeonDifficultiesHeroic = [2];
    private static readonly int[] DungeonDifficultiesHeroicMythic = [2, 8];
    private static readonly int[] DungeonDifficultiesMythic = [8];
    private static readonly int[] RaidDifficultiesLegacy10Normal = [3];
    private static readonly int[] RaidDifficultiesLegacy25Normal = [4];
    private static readonly int[] RaidDifficultiesLegacy10Heroic = [5];
    private static readonly int[] RaidDifficultiesLegacy25Heroic = [6];
    private static readonly int[] RaidDifficultiesLegacy1025 = [3, 4, 5, 6];
    private static readonly int[] RaidDifficultiesLegacy40 = [9];
    private static readonly int[] RaidDifficultiesLegacyLfr = [7];
    private static readonly int[] RaidDifficultiesNormal = [14];
    private static readonly int[] RaidDifficultiesHeroic = [15];
    private static readonly int[] RaidDifficultiesHeroicMythic = [15, 16];

    private static readonly int[] RaidDifficultiesAll = [17, 14, 15, 16];
    private static readonly int[] RaidDifficultiesLfrNormalHeroic = [3, 4, 5, 6, 7];
    private static readonly int[] RaidDifficultiesNoLfr = [14, 15, 16];
    private static readonly int[] RaidDifficultiesNormalHeroic = [14, 15];
    private static readonly int[] RaidDifficultiesTrialRecipes = [4, 5, 6];

    private static readonly List<ExtraItemDrop> AhnQiraj20ExtraDrops =
    [
        new(20736, RaidDifficultiesNormal), // Formula: Enchant Cloak - Dodge
        new(20734, RaidDifficultiesNormal), // Formula: Enchant Cloak - Stealth
        new(20729, RaidDifficultiesNormal), // Formula: Enchant Gloves - Fire Power
        new(20728, RaidDifficultiesNormal), // Formula: Enchant Gloves - Frost Power
        new(20730, RaidDifficultiesNormal), // Formula: Enchant Gloves - Healing Power
        new(20727, RaidDifficultiesNormal), // Formula: Enchant Gloves - Shadow Power
        new(20731, RaidDifficultiesNormal), // Formula: Enchant Gloves - Superior Agility
    ];

    private static readonly List<ExtraItemDrop> AhnQiraj40ExtraDrops =
    [
        new(20736, RaidDifficultiesLegacy40), // Formula: Enchant Cloak - Dodge
        new(20734, RaidDifficultiesLegacy40), // Formula: Enchant Cloak - Stealth
        new(20729, RaidDifficultiesLegacy40), // Formula: Enchant Gloves - Fire Power
        new(20728, RaidDifficultiesLegacy40), // Formula: Enchant Gloves - Frost Power
        new(20730, RaidDifficultiesLegacy40), // Formula: Enchant Gloves - Healing Power
        new(20727, RaidDifficultiesLegacy40), // Formula: Enchant Gloves - Shadow Power
        new(20731, RaidDifficultiesLegacy40), // Formula: Enchant Gloves - Superior Agility
    ];

    private static readonly List<ExtraItemDrop> MoltenCoreRecipes =
    [
        new(18260, RaidDifficultiesLegacy40), // Formula: Enchant Weapon - Healing Power
        new(18259, RaidDifficultiesLegacy40), // Formula: Enchant Weapon - Spellpower
        new(18252, RaidDifficultiesLegacy40), // Pattern: Core Armor Kit
        new(21371, RaidDifficultiesLegacy40), // Pattern: Core Felcloth Bag
        new(18265, RaidDifficultiesLegacy40), // Pattern: Flarecore Wraps
        new(18264, RaidDifficultiesLegacy40), // Plans: Elemental Sharpening Stone
        new(18257, RaidDifficultiesLegacy40), // Recipe: Major Rejuvenation Potion
        new(18290, RaidDifficultiesLegacy40), // Schematic: Biznicks 247x128 Accurascope
        new(18292, RaidDifficultiesLegacy40), // Schematic: Core Marksman Rifle
        new(18291, RaidDifficultiesLegacy40), // Schematic: Force Reactive Disk
    ];

    private static readonly List<ExtraItemDrop> Tier5Recipes =
    [
        new(30280, RaidDifficultiesLegacy25Normal), // Pattern: Belt of Blasting
        new(30302, RaidDifficultiesLegacy25Normal), // Pattern: Belt of Deep Shadow
        new(30301, RaidDifficultiesLegacy25Normal), // Pattern: Belt of Natural Power
        new(30303, RaidDifficultiesLegacy25Normal), // Pattern: Belt of the Black Eagle
        new(30281, RaidDifficultiesLegacy25Normal), // Pattern: Belt of the Long Road
        new(30282, RaidDifficultiesLegacy25Normal), // Pattern: Boots of Blasting
        new(30305, RaidDifficultiesLegacy25Normal), // Pattern: Boots of Natural Grace
        new(30307, RaidDifficultiesLegacy25Normal), // Pattern: Boots of the Crimson Hawk
        new(30283, RaidDifficultiesLegacy25Normal), // Pattern: Boots of the Long Road
        new(30306, RaidDifficultiesLegacy25Normal), // Pattern: Boots of Utter Darkness
        new(30308, RaidDifficultiesLegacy25Normal), // Pattern: Hurricane Boots
        new(30304, RaidDifficultiesLegacy25Normal), // Pattern: Monsoon Belt
        new(30321, RaidDifficultiesLegacy25Normal), // Plans: Belt of the Guardian
        new(30323, RaidDifficultiesLegacy25Normal), // Plans: Boots of the Protector
        new(30322, RaidDifficultiesLegacy25Normal), // Plans: Red Belt of Battle
        new(30324, RaidDifficultiesLegacy25Normal), // Plans: Red Havoc Boots
    ];

    private static readonly List<ExtraItemDrop> Tier14Recipes =
    [
        new(86238, RaidDifficultiesNormalHeroic), // Pattern: Chestguard of Nemeses
        new(86272, RaidDifficultiesNormalHeroic), // Pattern: Fists of Lightning
        new(86279, RaidDifficultiesNormalHeroic), // Pattern: Liferuned Leather Gloves
        new(86280, RaidDifficultiesNormalHeroic), // Pattern: Murderer's Gloves
        new(86281, RaidDifficultiesNormalHeroic), // Pattern: Nightfire Robe
        new(86283, RaidDifficultiesNormalHeroic), // Pattern: Raiment of Blood and Bone
        new(86284, RaidDifficultiesNormalHeroic), // Pattern: Raven Lord's Gloves
        new(86297, RaidDifficultiesNormalHeroic), // Pattern: Stormbreaker Chestguard
        new(86379, RaidDifficultiesNormalHeroic), // Pattern: Robe of Eternal Rule
        new(86380, RaidDifficultiesNormalHeroic), // Pattern: Imperial Silk Gloves
        new(86381, RaidDifficultiesNormalHeroic), // Pattern: Legacy of the Emperor
        new(86382, RaidDifficultiesNormalHeroic), // Pattern: Touch of the Light
        new(87408, RaidDifficultiesNormalHeroic), // Plans: Unyielding Bloodplate
        new(87409, RaidDifficultiesNormalHeroic), // Plans: Gauntlets of Battle Command
        new(87410, RaidDifficultiesNormalHeroic), // Plans: Ornate Battleplate of the Master
        new(87411, RaidDifficultiesNormalHeroic), // Plans: Bloodforged Warfists
        new(87412, RaidDifficultiesNormalHeroic), // Plans: Chestplate of Limitless Faith
        new(87413, RaidDifficultiesNormalHeroic), // Plans: Gauntlets of Unbound Devotion
    ];

    /*
     * The first number in each block is the JournalEncounter ID. If the encounter has been added
     * via ExtraEncounters, the number should be 1_(4 digit instance ID)_(0-based encounter index).
     * If you add an encounter to instance 123, that would be `1_0123_0`.
     */
    public static readonly Dictionary<int, List<ExtraItemDrop>> ExtraItemDrops = new()
    {
        {
            895, // Razorfen Kraul > Roogug
            [
                new(151443, DungeonDifficultiesNormal), // Roogug's Swinesteel Girdle - Normal
            ]
        },

        #region Miscellaneous

        // Darkmaul Citadel
        {
            1_0001_0, // Tunk
            [
                new(178162, DungeonDifficultiesNormal), // Tunk's Whomper
                new(178163, DungeonDifficultiesNormal), // Tunk's Shinguard
                new(178164, DungeonDifficultiesNormal), // Tunk's Needle
                new(178165, DungeonDifficultiesNormal), // Tunk's Tooth
                new(178166, DungeonDifficultiesNormal), // Tunk's Toothpick
                new(178167, DungeonDifficultiesNormal), // Tunk's Lil' Whomper
                new(179360, DungeonDifficultiesNormal), // Tunk's Tiny Bow
                // new(179362, DungeonDifficultiesNormawl), // Tunk's Backscratcher -- doesn't actually exist
            ]
        },
        {
            1_0001_1, // Gor'groth
            [
                new(178169, DungeonDifficultiesNormal), // Decrepit Dragonscale Drape
            ]
        },
        // Anniversary World Bosses
        {
            1_0002_0, // Archavon?
            [
                // Mount
                new(43959, DungeonDifficultiesNormal), // Reins of the Grand Black War Mammoth [A]
                new(44083, DungeonDifficultiesNormal), // Reins of the Grand Black War Mammoth [H]
                // Tier
                new(227266, DungeonDifficultiesNormal), // Heroes' Bonescythe Breastplate
                new(227246, DungeonDifficultiesNormal), // Heroes' Bonescythe Gauntlets
                new(227256, DungeonDifficultiesNormal), // Heroes' Bonescythe Legplates
                new(227247, DungeonDifficultiesNormal), // Heroes' Cryptstalker Handguards
                new(227257, DungeonDifficultiesNormal), // Heroes' Cryptstalker Legguards
                new(227267, DungeonDifficultiesNormal), // Heroes' Cryptstalker Tunic
                new(227269, DungeonDifficultiesNormal), // Heroes' Dreadnaught Battleplate
                new(227249, DungeonDifficultiesNormal), // Heroes' Dreadnaught Gauntlets
                new(227259, DungeonDifficultiesNormal), // Heroes' Dreadnaught Legplates
                new(227245, DungeonDifficultiesNormal), // Heroes' Dreamwalker Handgrips
                new(227255, DungeonDifficultiesNormal), // Heroes' Dreamwalker Legguards
                new(227265, DungeonDifficultiesNormal), // Heroes' Dreamwalker Raiments
                new(227248, DungeonDifficultiesNormal), // Heroes' Earthshatter Handguards
                new(227258, DungeonDifficultiesNormal), // Heroes' Earthshatter Legguards
                new(227268, DungeonDifficultiesNormal), // Heroes' Earthshatter Tunic
                new(227242, DungeonDifficultiesNormal), // Heroes' Frostfire Gloves
                new(227252, DungeonDifficultiesNormal), // Heroes' Frostfire Leggings
                new(227262, DungeonDifficultiesNormal), // Heroes' Frostfire Robe
                new(227244, DungeonDifficultiesNormal), // Heroes' Gloves of Faith
                new(227254, DungeonDifficultiesNormal), // Heroes' Leggings of Faith
                new(227243, DungeonDifficultiesNormal), // Heroes' Plagueheart Gloves
                new(227253, DungeonDifficultiesNormal), // Heroes' Plagueheart Leggings
                new(227263, DungeonDifficultiesNormal), // Heroes' Plagueheart Robe
                new(227251, DungeonDifficultiesNormal), // Heroes' Redemption Gloves
                new(227261, DungeonDifficultiesNormal), // Heroes' Redemption Greaves
                new(227271, DungeonDifficultiesNormal), // Heroes' Redemption Tunic
                new(227264, DungeonDifficultiesNormal), // Heroes' Robe of Faith
                new(227270, DungeonDifficultiesNormal), // Heroes' Scourgeborne Battleplate
                new(227250, DungeonDifficultiesNormal), // Heroes' Scourgeborne Gauntlets
                new(227260, DungeonDifficultiesNormal), // Heroes' Scourgeborne Legplates
                // PvP
                new(227213, DungeonDifficultiesNormal), // Hateful Gladiator's Chain Armor
                new(227226, DungeonDifficultiesNormal), // Hateful Gladiator's Chain Gauntlets
                new(227236, DungeonDifficultiesNormal), // Hateful Gladiator's Chain Leggings
                new(227209, DungeonDifficultiesNormal), // Hateful Gladiator's Dreadplate Chestpiece
                new(227223, DungeonDifficultiesNormal), // Hateful Gladiator's Dreadplate Gauntlets
                new(227233, DungeonDifficultiesNormal), // Hateful Gladiator's Dreadplate Legguards
                new(227231, DungeonDifficultiesNormal), // Hateful Gladiator's Felweave Handguards
                new(227221, DungeonDifficultiesNormal), // Hateful Gladiator's Felweave Raiment
                new(227241, DungeonDifficultiesNormal), // Hateful Gladiator's Felweave Trousers
                new(227227, DungeonDifficultiesNormal), // Hateful Gladiator's Kodohide Gloves
                new(227237, DungeonDifficultiesNormal), // Hateful Gladiator's Kodohide Legguards
                new(227215, DungeonDifficultiesNormal), // Hateful Gladiator's Kodohide Robes
                new(227228, DungeonDifficultiesNormal), // Hateful Gladiator's Leather Gloves
                new(227238, DungeonDifficultiesNormal), // Hateful Gladiator's Leather Legguards
                new(227214, DungeonDifficultiesNormal), // Hateful Gladiator's Leather Tunic
                new(227229, DungeonDifficultiesNormal), // Hateful Gladiator's Mooncloth Gloves
                new(227239, DungeonDifficultiesNormal), // Hateful Gladiator's Mooncloth Leggings
                new(227218, DungeonDifficultiesNormal), // Hateful Gladiator's Mooncloth Robe
                new(227211, DungeonDifficultiesNormal), // Hateful Gladiator's Ornamented Chestguard
                new(227224, DungeonDifficultiesNormal), // Hateful Gladiator's Ornamented Gloves
                new(227234, DungeonDifficultiesNormal), // Hateful Gladiator's Ornamented Legplates
                new(227210, DungeonDifficultiesNormal), // Hateful Gladiator's Plate Chestpiece
                new(227222, DungeonDifficultiesNormal), // Hateful Gladiator's Plate Gauntlets
                new(227232, DungeonDifficultiesNormal), // Hateful Gladiator's Plate Legguards
                new(227212, DungeonDifficultiesNormal), // Hateful Gladiator's Ringmail Armor
                new(227225, DungeonDifficultiesNormal), // Hateful Gladiator's Ringmail Gauntlets
                new(227235, DungeonDifficultiesNormal), // Hateful Gladiator's Ringmail Leggings
                new(227230, DungeonDifficultiesNormal), // Hateful Gladiator's Silk Handguards
                new(227220, DungeonDifficultiesNormal), // Hateful Gladiator's Silk Raiment
                new(227240, DungeonDifficultiesNormal), // Hateful Gladiator's Silk Trousers
            ]
        },
        {
            1_0002_1, // Doomwalker
            [
                new(208572, DungeonDifficultiesNormal), // Azure Worldchiller
                new(43959, DungeonDifficultiesNormal), // Reins of the Grand Black War Mammoth [A]
                new(44083, DungeonDifficultiesNormal), // Reins of the Grand Black War Mammoth [H]
                new(186469, DungeonDifficultiesNormal), // Illidari Doomhawk
                // Toy
                new(186501, DungeonDifficultiesNormal), // Doomwalker Trophy Stand
                // Cloth
                new(186460, DungeonDifficultiesNormal), // Anger-Spark Gloves
                new(186461, DungeonDifficultiesNormal), // Gilded Trousers of Benediction
                // Leather
                new(186475, DungeonDifficultiesNormal), // Hellstitched Mantle
                new(186463, DungeonDifficultiesNormal), // Terrorweave Tunic
                // Mail
                new(186481, DungeonDifficultiesNormal), // Darkcrest Waistguard
                new(186464, DungeonDifficultiesNormal), // Fathom-Helm of the Deeps
                // Plate
                new(186465, DungeonDifficultiesNormal), // Faceguard of the Endless Watch
                new(186484, DungeonDifficultiesNormal), // Voidforged Greaves
                // Cloak
                new(186462, DungeonDifficultiesNormal), // Black-Iron Battlecloak
                // Weapon
                new(186506, DungeonDifficultiesNormal), // Akama's Edge
                new(186467, DungeonDifficultiesNormal), // Barrel-Blade Longrifle
                new(186466, DungeonDifficultiesNormal), // Ethereum Nexus-Reaver
                new(186468, DungeonDifficultiesNormal), // Talon of the Tempest
            ]
        },
        {
            1_0002_2, // Sha of Anger?
            [
                // Mount
                new(87771, DungeonDifficultiesNormal), // Reins of the Heavenly Onyx Cloud Serpent
                // Tier
                new(227565, DungeonDifficultiesNormal), // Eternal Blossom Grips
                new(227564, DungeonDifficultiesNormal), // Eternal Blossom Legguards
                new(227556, DungeonDifficultiesNormal), // Firebird's Gloves
                new(227557, DungeonDifficultiesNormal), // Firebird's Kilt
                new(227575, DungeonDifficultiesNormal), // Gauntlets of the Lost Catacomb
                new(227574, DungeonDifficultiesNormal), // Greaves of the Lost Catacomb
                new(227573, DungeonDifficultiesNormal), // Gauntlets of Resounding Rings
                new(227591, DungeonDifficultiesNormal), // Gloves of the Burning Scroll
                new(227561, DungeonDifficultiesNormal), // Gloves of the Thousandfold Blades
                new(227586, DungeonDifficultiesNormal), // Guardian Serpent Gloves
                new(227587, DungeonDifficultiesNormal), // Guardian Serpent Leggings
                new(227590, DungeonDifficultiesNormal), // Leggings of the Burning Scroll
                new(227560, DungeonDifficultiesNormal), // Legguards of the Thousandfold Blades
                new(227572, DungeonDifficultiesNormal), // Legplates of Resounding Rings
                new(227598, DungeonDifficultiesNormal), // Red Crane Grips
                new(227599, DungeonDifficultiesNormal), // Red Crane Leggings
                new(227588, DungeonDifficultiesNormal), // Sha-Skin Gloves
                new(227589, DungeonDifficultiesNormal), // Sha-Skin Leggings
                new(227577, DungeonDifficultiesNormal), // White Tiger Gauntlets
                new(227576, DungeonDifficultiesNormal), // White Tiger Legplates
                new(227559, DungeonDifficultiesNormal), // Yaungol Slayer's Gloves
                new(227558, DungeonDifficultiesNormal), // Yaungol Slayer's Legguards
                // PvP
                new(227624, DungeonDifficultiesNormal), // Malevolent Gladiator's Armbands of Prowess
                new(227657, DungeonDifficultiesNormal), // Malevolent Gladiator's Armplates of Alacrity
                new(227656, DungeonDifficultiesNormal), // Malevolent Gladiator's Armplates of Proficiency
                new(227613, DungeonDifficultiesNormal), // Malevolent Gladiator's Armwraps of Accuracy
                new(227612, DungeonDifficultiesNormal), // Malevolent Gladiator's Armwraps of Alacrity
                new(227611, DungeonDifficultiesNormal), // Malevolent Gladiator's Belt of Cruelty
                new(227614, DungeonDifficultiesNormal), // Malevolent Gladiator's Bindings of Prowess
                new(227601, DungeonDifficultiesNormal), // Malevolent Gladiator's Boots of Alacrity
                new(227600, DungeonDifficultiesNormal), // Malevolent Gladiator's Boots of Cruelty
                new(227655, DungeonDifficultiesNormal), // Malevolent Gladiator's Bracers of Prowess
                new(227641, DungeonDifficultiesNormal), // Malevolent Gladiator's Cape of Cruelty
                new(227617, DungeonDifficultiesNormal), // Malevolent Gladiator's Chain Gauntlets
                new(227619, DungeonDifficultiesNormal), // Malevolent Gladiator's Chain Leggings
                new(227642, DungeonDifficultiesNormal), // Malevolent Gladiator's Cloak of Alacrity
                new(227635, DungeonDifficultiesNormal), // Malevolent Gladiator's Cord of Accuracy
                new(227634, DungeonDifficultiesNormal), // Malevolent Gladiator's Cord of Cruelty
                new(227636, DungeonDifficultiesNormal), // Malevolent Gladiator's Cord of Meditation
                new(227637, DungeonDifficultiesNormal), // Malevolent Gladiator's Cuffs of Accuracy
                new(227654, DungeonDifficultiesNormal), // Malevolent Gladiator's Clasp of Cruelty
                new(227639, DungeonDifficultiesNormal), // Malevolent Gladiator's Cuffs of Meditation
                new(227638, DungeonDifficultiesNormal), // Malevolent Gladiator's Cuffs of Prowess
                new(227640, DungeonDifficultiesNormal), // Malevolent Gladiator's Drape of Prowess
                new(227647, DungeonDifficultiesNormal), // Malevolent Gladiator's Dreadplate Gauntlets
                new(227650, DungeonDifficultiesNormal), // Malevolent Gladiator's Dreadplate Legguards
                new(227629, DungeonDifficultiesNormal), // Malevolent Gladiator's Felweave Handguards
                new(227632, DungeonDifficultiesNormal), // Malevolent Gladiator's Felweave Trousers
                new(227616, DungeonDifficultiesNormal), // Malevolent Gladiator's Footguards of Alacrity
                new(227602, DungeonDifficultiesNormal), // Malevolent Gladiator's Footguards of Alacrity
                new(227652, DungeonDifficultiesNormal), // Malevolent Gladiator's Girdle of Accuracy
                new(227653, DungeonDifficultiesNormal), // Malevolent Gladiator's Girdle of Prowess
                new(227644, DungeonDifficultiesNormal), // Malevolent Gladiator's Greaves of Alacrity
                new(227604, DungeonDifficultiesNormal), // Malevolent Gladiator's Ironskin Gloves
                new(227607, DungeonDifficultiesNormal), // Malevolent Gladiator's Ironskin Legguards
                new(227603, DungeonDifficultiesNormal), // Malevolent Gladiator's Leather Gloves
                new(227606, DungeonDifficultiesNormal), // Malevolent Gladiator's Leather Legguards
                new(227622, DungeonDifficultiesNormal), // Malevolent Gladiator's Links of Cruelty
                new(227630, DungeonDifficultiesNormal), // Malevolent Gladiator's Mooncloth Gloves
                new(227633, DungeonDifficultiesNormal), // Malevolent Gladiator's Mooncloth Leggings
                new(227651, DungeonDifficultiesNormal), // Malevolent Gladiator's Plate Legguards
                new(227646, DungeonDifficultiesNormal), // Malevolent Gladiator's Ornamented Gloves
                new(227649, DungeonDifficultiesNormal), // Malevolent Gladiator's Ornamented Legplates
                new(227648, DungeonDifficultiesNormal), // Malevolent Gladiator's Plate Gauntlets
                new(227618, DungeonDifficultiesNormal), // Malevolent Gladiator's Ringmail Gauntlets
                new(227620, DungeonDifficultiesNormal), // Malevolent Gladiator's Ringmail Leggings
                new(227615, DungeonDifficultiesNormal), // Malevolent Gladiator's Sabatons of Cruelty
                new(227628, DungeonDifficultiesNormal), // Malevolent Gladiator's Silk Handguards
                new(227631, DungeonDifficultiesNormal), // Malevolent Gladiator's Silk Trousers
                new(227626, DungeonDifficultiesNormal), // Malevolent Gladiator's Treads of Alacrity
                new(227625, DungeonDifficultiesNormal), // Malevolent Gladiator's Treads of Cruelty
                new(227627, DungeonDifficultiesNormal), // Malevolent Gladiator's Treads of Meditation
                new(227609, DungeonDifficultiesNormal), // Malevolent Gladiator's Waistband of Cruelty
                new(227621, DungeonDifficultiesNormal), // Malevolent Gladiator's Waistguard of Meditation
                new(227645, DungeonDifficultiesNormal), // Malevolent Gladiator's Warboots of Alacrity
                new(227643, DungeonDifficultiesNormal), // Malevolent Gladiator's Warboots of Cruelty
                new(227610, DungeonDifficultiesNormal), // Malevolent Gladiator's Waistband of Accuracy
                new(227623, DungeonDifficultiesNormal), // Malevolent Gladiator's Wristguards of Alacrity
                new(227605, DungeonDifficultiesNormal), // Malevolent Gladiator's Wyrmhide Gloves
                new(227608, DungeonDifficultiesNormal), // Malevolent Gladiator's Wyrmhide Legguards
            ]
        },
        {
            1_0002_3, // Azuregos
            [
                new(150419, DungeonDifficultiesNormal), // Crystal Adorned Crown
                new(150425, DungeonDifficultiesNormal), // Snowblind Shoes
                // Leather
                new(150543, DungeonDifficultiesNormal), // Sapphire-Encrusted Tunic
                // Mail
                new(150544, DungeonDifficultiesNormal), // Mana-Frosted Pauldrons
                // Plate
                new(150422, DungeonDifficultiesNormal), // Unmelting Ice Girdle
                // Cloak
                new(150417, DungeonDifficultiesNormal), // Drape of Benediction
                // Weapon
                new(150424, DungeonDifficultiesNormal), // Cold Snap
                new(150428, DungeonDifficultiesNormal), // Eskhandar's Left Claw
                new(150423, DungeonDifficultiesNormal), // Fang of the Mystics
                new(150421, DungeonDifficultiesNormal), // Typhoon
            ]
        },
        {
            1_0002_4, // Lord Kazzak
            [
                new(230011, DungeonDifficultiesNormal), // Lil'Kaz
                // Cloth
                new(150386, DungeonDifficultiesNormal), // Blacklight Bracer
                new(150385, DungeonDifficultiesNormal), // Fel Infused Leggings
                // Leather
                new(150382, DungeonDifficultiesNormal), // Doomhide Gauntlets
                new(150381, DungeonDifficultiesNormal), // Flayed Doomguard Belt
                // Mail
                new(150379, DungeonDifficultiesNormal), // Infernal Headcage
                // Cloak
                new(150380, DungeonDifficultiesNormal), // Eskhandar's Pelt
                // Weapon
                new(150383, DungeonDifficultiesNormal), // Amberseal Keeper
                new(150427, DungeonDifficultiesNormal), // Empyrean Demolisher
            ]
        },
        {
            1_0002_5, // Dragons of Nightmare
            [
                new(150411, DungeonDifficultiesNormal), // Green Dragonskin Cloak
                // Weapon
                new(150429, DungeonDifficultiesNormal), // Emerald Dragonfang
                new(150412, DungeonDifficultiesNormal), // Hammer of Bestial Fury
                new(150393, DungeonDifficultiesNormal), // Nightmare Blade
                new(150403, DungeonDifficultiesNormal), // Polished Ironwood Crossbow
                new(150408, DungeonDifficultiesNormal), // Staff of Rampant Growth
            ]
        },
        {
            1_0002_6, // Emeriss
            [
                new(150416, DungeonDifficultiesNormal), // Gloves of Delusional Power
                // Leather
                new(150405, DungeonDifficultiesNormal), // Circlet of Restless Dreams
                new(150415, DungeonDifficultiesNormal), // Dragonspur Wraps
                // Mail
                new(150406, DungeonDifficultiesNormal), // Boots of the Endless Moor
                // Plate
                new(150410, DungeonDifficultiesNormal), // Acid Inscribed Greaves
            ]
        },
        {
            1_0002_7, // Lethon
            [
                new(150399, DungeonDifficultiesNormal), // Black Bark Wristbands
                // Leather
                new(150398, DungeonDifficultiesNormal), // Dark Heart Pants
                new(150401, DungeonDifficultiesNormal), // Deviate Growth Cap
                // Mail
                new(150400, DungeonDifficultiesNormal), // Malignant Footguards
                // Plate
                new(150402, DungeonDifficultiesNormal), // Gauntlets of the Shining Light
            ]
        },
        {
            1_0002_8, // Taerar
            [
                new(150394, DungeonDifficultiesNormal), // Mendicant's Slippers
                // Leather
                new(150395, DungeonDifficultiesNormal), // Unnatural Leather Spaulders
                // Mail
                new(150414, DungeonDifficultiesNormal), // Ancient Corroded Leggings
                // Plate
                new(150413, DungeonDifficultiesNormal), // Dragonbone Wristguards
                new(150390, DungeonDifficultiesNormal), // Strangely Glyphed Legplates
            ]
        },
        {
            1_0002_9, // Ysondre
            [
                new(150397, DungeonDifficultiesNormal), // Belt of the Dark Bog
                new(150391, DungeonDifficultiesNormal), // Jade Inlaid Vestments
                // Leather
                new(150396, DungeonDifficultiesNormal), // Boots of Fright
                // Mail
                new(150389, DungeonDifficultiesNormal), // Leggings of the Demented Mind
                // Plate
                new(150387, DungeonDifficultiesNormal), // Acid Inscribed Pauldrons
                // Weapon
                new(150409, DungeonDifficultiesNormal), // Trance Stone
            ]
        },
//        {
//            1_0003_0, // Treasure Goblin - No longer active
//            new List<ExtraItemDrop>
//            {
//                // Mount
//                new(76755, DungeonDifficultiesNormal), // Tyrael's Charger
//                // Pet
//                new(3580, DungeonDifficultiesNormal), // Baa'lial
//               // Toy
//               new(206008, DungeonDifficultiesNormal), // Nightmare Banner
//                new(142542, DungeonDifficultiesNormal), // Tome of Town Portal
//                new(143543, DungeonDifficultiesNormal), // Twelve-String Guitar
//                // Cosmetic
//                new(206020, DungeonDifficultiesNormal), // Enmity Hood
//                new(206004, DungeonDifficultiesNormal), // Enmity Cloak
//                new(206007, DungeonDifficultiesNormal), // Treasure Nabbin' Bag
//               // Weapon
//                new(206275, DungeonDifficultiesNormal), // Wirt's Fighting Leg
//                new(206276, DungeonDifficultiesNormal), // Wirt's Haunted Leg
//                new(206005, DungeonDifficultiesNormal), // Wirt's Last Leg
//                new(143327, DungeonDifficultiesNormal), // Livestock Lochaber Axe
//            }
//        },

        #endregion

        #region Classic

        // Shadowfang Keep > Fel Steed
        {
            1_0064_0,
            [
                new(6341, DungeonDifficultiesNormal), // Eerie Stable Lantern
            ]
        },
        // Shadowfang Keep > Deathsworn Captain
        {
            1_0064_1,
            [
                new(6642, DungeonDifficultiesNormal), // Phantom Armor
                // Weapon
                new(6641, DungeonDifficultiesNormal), // Haunting Blade
            ]
        },
//        // Blackrock Depths > Theldren - (Mostly) Unavailable
//        {
//            10228?,
//            new List<ExtraItemDrop>
//            {
//                // Cloak
//                new(22330, DungeonDifficultiesNormal), // Shroud of Arcane Mastery
//                // Weapon
//                new(22317, DungeonDifficultiesNormal), // Lefty's Brass Knuckle
//                new(22318, DungeonDifficultiesNormal), // Malgen's Long Bow
//            }
//        },
        // Blackrock Depths > Verek
        {
            1_0228_0,
            [
                new(22242, DungeonDifficultiesNormal), // Verek's Leash
            ]
        },
        // Blackrock Depths > Watchman Doomgrip
        {
            1_0228_1,
            [
                new(22256, DungeonDifficultiesNormal), // Mana Shaping Handwraps
                // Plate
                new(22205, DungeonDifficultiesNormal), // Black Steel Bindings
                // Weapon
                new(22254, DungeonDifficultiesNormal), // Wand of Eternal Light
            ]
        },
        // Blackrock Depths > Panzor the Invincible
        {
            1_0228_2,
            [
                new(22245, DungeonDifficultiesNormal), // Soot Encrusted Footwear
                // Plate
                new(11787, DungeonDifficultiesNormal), // Shalehusk Boots
                // Weapon
                new(11786, DungeonDifficultiesNormal), // Stone of the Earth
                new(11785, DungeonDifficultiesNormal), // Rock Golem Bulwark
            ]
        },
        // Lower Blackrock Spire > Burning Felguard
        {
            1_0229_0,
            [
                new(13181, DungeonDifficultiesNormal), // Demonskin Gloves
                // Weapon
                new(13182, DungeonDifficultiesNormal), // Phase Blade
            ]
        },
        // Lower Blackrock Spire > Spirestone Battle Lord
        {
            1_0229_1,
            [
                new(13284, DungeonDifficultiesNormal), // Swiftdart Battleboots
                // Weapon
                new(13285, DungeonDifficultiesNormal), // The Blackrock Slicer
            ]
        },
        // Lower Blackrock Spire > Spirestone Butcher
        {
            1_0229_2,
            [
                new(12608, DungeonDifficultiesNormal), // Butcher's Apron
                // Weapon
                new(13286, DungeonDifficultiesNormal), // Rivenspike
            ]
        },
        // Lower Blackrock Spire > Spirestone Lord Magus
        {
            1_0229_3,
            [
                new(13282, DungeonDifficultiesNormal), // Ogreseer Tower Boots
                // Weapon
                new(13261, DungeonDifficultiesNormal), // Globe of D'sak
            ]
        },
//        // Lower Blackrock Spire > Mor Grayhoof - (Mostly) Unavailable
//        {
//            10229?,
//            new List<ExtraItemDrop>
//            {
//                // Cloth
//                new(22306, DungeonDifficultiesNormal), // Ironweave Belt
//                // Leather
//                new(22325, DungeonDifficultiesNormal), // Belt of the Trickster
//                // Weapon
//                new(22322, DungeonDifficultiesNormal), // The Jaw Breaker
//                new(22319, DungeonDifficultiesNormal), // Tome of Divine Right
//            }
//        },
        // Lower Blackrock Spire > Bannok Grimaxe
        {
            1_0229_4,
            [
                new(12634, DungeonDifficultiesNormal), // Chiselbrand Girdle
                // Plate
                new(12637, DungeonDifficultiesNormal), // Backusarian Gauntlets
                // Weapon
                new(12621, DungeonDifficultiesNormal), // Demonfork
            ]
        },
        // Lower Blackrock Spire > Crystal Fang
        {
            1_0229_5,
            [
                new(13185, DungeonDifficultiesNormal), // Sunderseer Mantle
                // Leather
                new(13184, DungeonDifficultiesNormal), // Fallbrush Handgrips
                // Weapon
                new(13218, DungeonDifficultiesNormal), // Fang of the Crystal Spider
            ]
        },
        // Lower Blackrock Spire > Ghok Bashguud
        {
            1_0229_6,
            [
                new(13203, DungeonDifficultiesNormal), // Armswake Cloak
                // Weapon
                new(13204, DungeonDifficultiesNormal), // Bashguuder
                new(13198, DungeonDifficultiesNormal), // Hurd Smasher
            ]
        },
//        // Dire Maul > Isalien - (Mostly) unavailable
//        {
//            10230?,
//            new List<ExtraItemDrop>
//            {
//                // Cloth
//                new(22304, DungeonDifficultiesNormal), // Ironweave Gloves
//                // Leather
//                new(22472, DungeonDifficultiesNormal), // Boots of Ferocity
//                // Weapon
//                new(22315, DungeonDifficultiesNormal), // Hammer of Revitalization
//                new(22314, DungeonDifficultiesNormal), // Huntsman's Harpoon
//            }
//        },
        // Dire Maul > Tsu'zee
        {
            1_0230_0,
            [
                new(18387, DungeonDifficultiesNormal), // Brightspark Gloves
                new(18346, DungeonDifficultiesNormal), // Threadbare Trousers
            ]
        },
//        // Dire Maul > Lord Hel'nurath - (Mostly) unavailable
//        {
//            10230?,
//            new List<ExtraItemDrop>
//            {
//                // Cloth
//                new(18757, DungeonDifficultiesNormal), // Diabolic Mantle
//                // Plate
//                new(18754, DungeonDifficultiesNormal), // Fel Hardened Bracers
//                // Weapon
//                new(18755, DungeonDifficultiesNormal), // Xorothian Firestick
//                new(18756, DungeonDifficultiesNormal), // Dreadguard's Protector
//            }
//        },
        // Dire Maul > Gordok Tribute
        {
            1_1277_0,
            [
                new(18532, DungeonDifficultiesNormal), // Mindsurge Robe
                new(18475, DungeonDifficultiesNormal), // Oddly Magical Belt
                // Leather
                new(18528, DungeonDifficultiesNormal), // Cyclone Spaulders
                new(18478, DungeonDifficultiesNormal), // Hyena Hide Jerkin
                new(18476, DungeonDifficultiesNormal), // Mud Stained Boots
                new(18477, DungeonDifficultiesNormal), // Shaggy Leggings
                // Mail
                new(18479, DungeonDifficultiesNormal), // Carrion Scorpid Helm
                new(18530, DungeonDifficultiesNormal), // Ogre Forged Hauberk
                // Plate
                new(18529, DungeonDifficultiesNormal), // Elemental Plate Girdle
                new(18533, DungeonDifficultiesNormal), // Gordok Bracers of Power
                new(18480, DungeonDifficultiesNormal), // Scarab Plate Helm
                // Cloak
                new(18495, DungeonDifficultiesNormal), // Redoubt Cloak
                // Weapon
                new(18538, DungeonDifficultiesNormal), // Treant's Bane
                new(18481, DungeonDifficultiesNormal), // Skullcracking Mace
                new(18531, DungeonDifficultiesNormal), // Unyielding Maul
                new(18534, DungeonDifficultiesNormal), // Rod of the Ogre Magi
                new(18482, DungeonDifficultiesNormal), // Ogre Toothpick Shooter
                new(18499, DungeonDifficultiesNormal), // Barrier Shield
            ]
        },
        // Gnomeregan > Dark Iron Ambassador
        {
            1_0231_0,
            [
                new(5108, DungeonDifficultiesNormal), // Dark Iron Leather
                new(9455, DungeonDifficultiesNormal), // Emissary Cuffs
                // Weapon
                new(9456, DungeonDifficultiesNormal), // Glass Shooter
                new(9457, DungeonDifficultiesNormal), // Royal Diplomatic Scepter
            ]
        },
        // Gnomeregan > Endgineer Omegaplugg
        {
            1_0231_1,
            [
                new(141331, DungeonDifficultiesNormal), // Vial of Green Goo
            ]
        },
        // Maraudon > Meshlok the Harvester
        {
            1_0232_0,
            [
                new(17741, DungeonDifficultiesNormal), // Nature's Embrace
                // Leather
                new(17742, DungeonDifficultiesNormal), // Fungus Shroud Armor
                // Plate
                new(17767, DungeonDifficultiesNormal), // Bloomsprout Headpiece
            ]
        },
        // Razorfen Downs > Sah'rhee
        {
            1_0233_0,
            [
                new(10760, DungeonDifficultiesNormal), // Swine Fists
                // Mail
                new(10768, DungeonDifficultiesNormal), // Boar Champion's Belt
                // Plate
                new(151454, DungeonDifficultiesNormal), // Splinterbone Sabatons
                // Weapon
                new(10766, DungeonDifficultiesNormal), // Plaguerot Sprig
                new(10758, DungeonDifficultiesNormal), // X'caliboar
                new(10767, DungeonDifficultiesNormal), // Savage Boar's Guard
            ]
        },
        // Razorfen Kraul > Kraulshaper Tukaar
        {
            1_0234_0,
            [
                new(6688, DungeonDifficultiesNormal), // Whisperwind Headdress
                // Weapon
                new(6689, DungeonDifficultiesNormal), // Wind Spirit Staff
            ]
        },
        // Razorfen Kraul > Enormous Bullfrog
        {
            1_0234_1,
            [
                new(65, DungeonDifficultiesNormal), // Whisperwind Headdress
                new(64, DungeonDifficultiesNormal), // Whisperwind Headdress
                // Cloth
                new(2277, DungeonDifficultiesNormal), // Necromancer Leggings
                new(9395, DungeonDifficultiesNormal), // Gloves of Old
                new(6658, DungeonDifficultiesNormal), // Holy Shroud
                new(13106, DungeonDifficultiesNormal), // Glowing Magical Bracelets
                // Leather
                new(3020, DungeonDifficultiesNormal), // Enduring Cap
                new(2278, DungeonDifficultiesNormal), // Forest Tracker Epaulets
                // Mail
                new(13127, DungeonDifficultiesNormal), // Frostreaver Crown
                new(9405, DungeonDifficultiesNormal), // Girdle of Golem Strength
                new(13124, DungeonDifficultiesNormal), // Ravasaur Scale Boots
                // Cloak
                new(13108, DungeonDifficultiesNormal), // Tigerstrike Mantle
                // Weapon
                new(13019, DungeonDifficultiesNormal), // Harpyclaw Short Bow
                new(13045, DungeonDifficultiesNormal), // Viscous Hammer
                new(13048, DungeonDifficultiesNormal), // Looming Gavel
                new(12974, DungeonDifficultiesNormal), // The Black Knight
                new(2912, DungeonDifficultiesNormal), // Claw of the Shadowmancer
                new(2877, DungeonDifficultiesNormal), // Combatant Claymore
                new(13037, DungeonDifficultiesNormal), // Crystalpine Stinger
                new(791, DungeonDifficultiesNormal), // Gnarled Ash Staff
                new(13063, DungeonDifficultiesNormal), // Starfaller
                new(13033, DungeonDifficultiesNormal), // Zealot Blade
                new(2565, DungeonDifficultiesNormal), // Rod of Molten Fire
                new(13137, DungeonDifficultiesNormal), // Ironweaver
                new(2299, DungeonDifficultiesNormal), // Burning War Axe
            ]
        },
        // Stratholme > Postmaster Malown
        {
            1_0236_0,
            [
                new(13390, DungeonDifficultiesNormal), // The Postmaster's Band
                new(13391, DungeonDifficultiesNormal), // The Postmaster's Treads
                new(13389, DungeonDifficultiesNormal), // The Postmaster's Trousers
                new(13388, DungeonDifficultiesNormal), // The Postmaster's Tunic
                // Weapon
                new(13393, DungeonDifficultiesNormal), // Malown's Slam
            ]
        },
        // Stratholme > Skul
        {
            1_0236_1,
            [
                new(13395, DungeonDifficultiesNormal), // Skul's Fingerbone Claws
                // Plate
                new(13394, DungeonDifficultiesNormal), // Skul's Cold Embrace
                // Weapon
                new(13396, DungeonDifficultiesNormal), // Skul's Ghastly Touch
            ]
        },
//        // Stratholme > Sothos and Jarien - (Mostly) unavailable
//        {
//            10236?,
//            new List<ExtraItemDrop>
//            {
//                // Cloth
//                new(22301, DungeonDifficultiesNormal), // Ironweave Robe
//                // Plate
//                new(22328, DungeonDifficultiesNormal), // Legplates of Vigilance
//                // Weapon
//                new(22329, DungeonDifficultiesNormal), // Scepter of Interminable Focus
//            }
//        },
        // Stratholme > Stonespine
        {
            1_1292_0,
            [
                new(13954, DungeonDifficultiesNormal), // Verdant Footpads
                // Cloak
                new(13397, DungeonDifficultiesNormal), // Stoneskin Gargoyle Cape
                // Weapon
                new(13399, DungeonDifficultiesNormal), // Gargoyle Shredder Talons
            ]
        },
        // Wailing Caverns > Druid of the Fang
        {
            1_0240_0,
            [
                new(10413, DungeonDifficultiesNormal), // Gloves of the Fang
                // Mail
                new(132743, DungeonDifficultiesNormal), // Slither-Scale Gauntlets
                new(208019, DungeonDifficultiesNormal), // Quagmire Trudgers
                // Plate
                new(208020, DungeonDifficultiesNormal), // Dagmire Gloves
                // Weapon
                new(208018, DungeonDifficultiesNormal), // Fangblade
                new(208021, DungeonDifficultiesNormal), // Sizzling Stick
            ]
        },
        // Wailing Caverns > Deviate Faerie Dragon
        {
            1_0240_1,
            [
                new(6632, DungeonDifficultiesNormal), // Feyscale Cloak
                // Weapon
                new(5243, DungeonDifficultiesNormal), // Firebelcher
            ]
        },
        // Zul'Farrak > Sandarr Dunereaver
        {
            1_0241_0,
            [
                new(9484, DungeonDifficultiesNormal), // Spellshock Leggings
                // Cloak
                new(9512, DungeonDifficultiesNormal), // Blackmetal Cape
                // Weapon
                new(9482, DungeonDifficultiesNormal), // Witch Doctor's Cane
                new(9511, DungeonDifficultiesNormal), // Bloodletter Scalpel
                new(9483, DungeonDifficultiesNormal), // Flaming Incinerator
                new(5616, DungeonDifficultiesNormal), // Gutwrencher
                new(9481, DungeonDifficultiesNormal), // The Minotaur
                new(2040, DungeonDifficultiesNormal), // Troll Protector
                new(9480, DungeonDifficultiesNormal), // Eyegouger
            ]
        },
        // Zul'Farrak > Zerillis
        {
            1_0241_1,
            [
                new(12470, DungeonDifficultiesNormal), // Sandstalker Ankleguards
            ]
        },
        // Zul'Farrak > Dustwraith
        {
            1_0241_2,
            [
                new(12471, DungeonDifficultiesNormal), // Desertwalker Cane
            ]
        },
        // Ruins of Ahn'Qiraj > Captains
        {
            1_0743_0,
            [
                new(21810, DungeonDifficultiesNormal), // Treads of the Wandering Nomad
                // Weapon
                new(21806, DungeonDifficultiesNormal), // Gavel of Qiraji Authority
            ]
        },
        // Blackrock Depths / Ring of Law
        {
            372,
            [
                new(22271, DungeonDifficultiesNormal), // Leggings of Frenzied Magic
                // Plate
                new(22270, DungeonDifficultiesNormal), // Entrenching Boots
                // Weapon
                new(11702, DungeonDifficultiesNormal), // Grizzle's Skinner
            ]
        },
        // Blackrock Depths / Lord Incendius
        {
            374,
            [
                new(11768, DungeonDifficultiesNormal), // Incendic Bracers
            ]
        },
        // Blackrock Depths / Fineous Darkvire
        {
            376,
            [
                new(11840, DungeonDifficultiesNormal), // Master Builder's Shirt
            ]
        },
        // Blackrock Depths / Hurley Blackbreath
        {
            380,
            [
                new(22275, DungeonDifficultiesNormal), // Firemoss Boots
            ]
        },
        // Blackrock Depths / Hurley Blackbreath
        {
            381,
            [
                new(11743, DungeonDifficultiesNormal), // Rockfist
            ]
        },
        // Blackrock Depths / Emperor Dagran Thaurissan
        {
            387,
            [
                new(22204, DungeonDifficultiesNormal), // Wristguards of Renown
            ]
        },
        // Stratholme / Willey Hopebreaker
        {
            446,
            [
                new(22406, DungeonDifficultiesNormal), // Redemption
            ]
        },
        // The Temple of Atal'Hakker / Wardens of the Dream
        {
            459,
            [
                new(12465, DungeonDifficultiesNormal), // Nightfall Drape
            ]
        },
        // Zul'Farrak / Chief Ukorz Sandscalp
        {
            489,
            [
                new(9372, DungeonDifficultiesNormal), // Sul'thraze the Lasher
            ]
        },
        // Scholomance / Darkmaster Gandling
        {
            684,
            [
                new(88357, DungeonDifficultiesNormal), // Vigorsteel Spaulders
            ]
        },
        // Molten Core / Lucifron
        { 1519, MoltenCoreRecipes },
        // Molten Core / Magmadar
        { 1520, MoltenCoreRecipes },
        // Molten Core / Gehennas
        { 1521, MoltenCoreRecipes },
        // Molten Core / Garr
        {
            1522,
            MoltenCoreRecipes.Concat([
                new(19019, RaidDifficultiesLegacy40), // Thunderfury, Blessed Blade of the Windseeker
            ]).ToList()
        },
        // Molten Core / Shazzrah
        { 1523, MoltenCoreRecipes },
        // Molten Core / Baron Geddon
        {
            1524,
            MoltenCoreRecipes.Concat([
                new(19019, RaidDifficultiesLegacy40), // Thunderfury, Blessed Blade of the Windseeker
            ]).ToList()
        },
        // Molten Core / Sulfuron Harbinger
        {
            1525,
            [
                new(17223, RaidDifficultiesLegacy40), // Thunderstrike
            ]
        },
        // Molten Core / Golemagg the Incinerator
        { 1526, MoltenCoreRecipes },
        // Molten Core / Ragnaros
        {
            1528,
            [
                new(138018, RaidDifficultiesLegacy40), // Clothes Chest Pattern: Molten Core
                new(17182, RaidDifficultiesLegacy40), // Sulfuras, Hand of Ragnaros
            ]
        },
        // AQ20
        { 1537, AhnQiraj20ExtraDrops }, // Kurinnaxx
        { 1538, AhnQiraj20ExtraDrops }, // General Rajaxx
        { 1539, AhnQiraj20ExtraDrops }, // Moam
        { 1540, AhnQiraj20ExtraDrops }, // Buru the Gorger
        { 1541, AhnQiraj20ExtraDrops }, // Ayamiss the Hunter
        { 1542, AhnQiraj20ExtraDrops }, // Ossirian the Unscarred
        // AQ40
        { 1543, AhnQiraj40ExtraDrops }, // The Prophet Skeram
        { 1544, AhnQiraj40ExtraDrops }, // Battleguard Sartura
        { 1545, AhnQiraj40ExtraDrops }, // Fankriss the Unyielding
        { 1546, AhnQiraj40ExtraDrops }, // Princess Huhuran
        { 1547, AhnQiraj40ExtraDrops }, // Silithid Royalty
        { 1548, AhnQiraj40ExtraDrops }, // Viscidus
        { 1550, AhnQiraj40ExtraDrops }, // Ouro
        { 1551, AhnQiraj40ExtraDrops }, // C'Thun

        #endregion

        #region Classic Trash

        {
            1000741, // Molten Core > Trash
            [
                new(16802, RaidDifficultiesLegacy40), // Arcanist Belt
                new(16799, RaidDifficultiesLegacy40), // Arcanist Bindings
                new(16817, RaidDifficultiesLegacy40), // Girdle of Prophecy
                new(16806, RaidDifficultiesLegacy40), // Felheart Belt
                new(16804, RaidDifficultiesLegacy40), // Felheart Bracers
                new(16819, RaidDifficultiesLegacy40), // Vambraces of Prophecy
                // Leather
                new(16828, RaidDifficultiesLegacy40), // Cenarion Belt
                new(16830, RaidDifficultiesLegacy40), // Cenarion Bracers
                new(16827, RaidDifficultiesLegacy40), // Nightslayer Belt
                new(16825, RaidDifficultiesLegacy40), // Nightslayer Bracelets
                // Mail
                new(16838, RaidDifficultiesLegacy40), // Earthfury Belt
                new(16840, RaidDifficultiesLegacy40), // Earthfury Bracers
                new(16851, RaidDifficultiesLegacy40), // Giantstalker's Belt
                new(16850, RaidDifficultiesLegacy40), // Giantstalker's Bracers
                // Plate
                new(16864, RaidDifficultiesLegacy40), // Belt of Might
                new(16861, RaidDifficultiesLegacy40), // Bracers of Might
                new(16858, RaidDifficultiesLegacy40), // Lawbringer Belt
                new(16857, RaidDifficultiesLegacy40), // Lawbringer Bracers
            ]
        },
        {
            1000742, // Blackwing Lair > Trash
            [
                new(19437, RaidDifficultiesLegacy40), // Boots of Pure Thought
                new(19438, RaidDifficultiesLegacy40), // Ringo's Blizzard Boots
                // Leather
                new(19439, RaidDifficultiesLegacy40), // Interlaced Shadow Jerkin
                // Cloak
                new(19436, RaidDifficultiesLegacy40), // Cloak of Draconic Might
                // Weapon
                new(19362, RaidDifficultiesLegacy40), // Doom's Edge
                new(19354, RaidDifficultiesLegacy40), // Draconic Avenger
                new(19358, RaidDifficultiesLegacy40), // Draconic Maul
                new(19435, RaidDifficultiesLegacy40), // Essence Gatherer
            ]
        },
        {
            1000743, // Ruins of Ahn'Qiraj > Trash
            [
                new(21804, RaidDifficultiesLegacy10Normal), // Coif of Elemental Fury
                // Plate
                new(21803, RaidDifficultiesLegacy10Normal), // Helm of the Holy Avenger
                new(21805, RaidDifficultiesLegacy10Normal), // Polished Obsidian Pauldrons
                // Weapon
                new(21801, RaidDifficultiesLegacy10Normal), // Antenna of Invigoration
                new(21800, RaidDifficultiesLegacy10Normal), // Silithid Husked Launcher
                new(21802, RaidDifficultiesLegacy10Normal), // The Lost Kris of Zedd
            ]
        },
        {
            1000744, // Temple of Ahn'Qiraj > Trash
            [
                new(21838, RaidDifficultiesLegacy40), // Garb of Royal Ascension
                new(21888, RaidDifficultiesLegacy40), // Gloves of the Immortal
                // Plate
                new(21889, RaidDifficultiesLegacy40), // Gloves of the Redeemed Prophecy
                // Weapon
                new(21837, RaidDifficultiesLegacy40), // Anubisath Warhammer
                new(21856, RaidDifficultiesLegacy40), // Neretzek, The Blood Drinker

                new(21890, RaidDifficultiesLegacy40), // Gloves of the Fallen Prophet
            ]
        },

        #endregion

        #region The Burning Crusade

        // Old Hillsbrad Foothills / Don Carlos
        {
            1_0251_0,
            [
                new(134019, DungeonDifficultiesHeroic), // Don Carlos' Famous Hat
            ]
        },

        #endregion

        #region The Burning Crusade Trash

        {
            1000752, // Sunwell Plateau > Trash
            [
                new(35202, RaidDifficultiesLegacy25Normal), // Design: Amulet of Flowing Life
                new(35200, RaidDifficultiesLegacy25Normal), // Design: Hard Khorium Band
                new(35203, RaidDifficultiesLegacy25Normal), // Design: Hard Khorium Choker
                new(35198, RaidDifficultiesLegacy25Normal), // Design: Loop of Forged Power
                new(35201, RaidDifficultiesLegacy25Normal), // Design: Pendant of Sunfire
                new(35199, RaidDifficultiesLegacy25Normal), // Design: Ring of Flowing Life
                new(35218, RaidDifficultiesLegacy25Normal), // Pattern: Carapace of Sun and Shadow
                new(35217, RaidDifficultiesLegacy25Normal), // Pattern: Embrace of the Phoenix
                new(35213, RaidDifficultiesLegacy25Normal), // Pattern: Fletcher's Gloves of the Phoenix
                new(35214, RaidDifficultiesLegacy25Normal), // Pattern: Gloves of Immortal Dusk
                new(35205, RaidDifficultiesLegacy25Normal), // Pattern: Hands of Eternal Light
                new(35216, RaidDifficultiesLegacy25Normal), // Pattern: Leather Chestguard of the Sun
                new(35212, RaidDifficultiesLegacy25Normal), // Pattern: Leather Gauntlets of the Sun
                new(35207, RaidDifficultiesLegacy25Normal), // Pattern: Robe of Eternal Light
                new(35219, RaidDifficultiesLegacy25Normal), // Pattern: Sun-Drenched Scale Chestguard
                new(35215, RaidDifficultiesLegacy25Normal), // Pattern: Sun-Drenched Scale Gloves
                new(35204, RaidDifficultiesLegacy25Normal), // Pattern: Sunfire Handwraps
                new(35206, RaidDifficultiesLegacy25Normal), // Pattern: Sunfire Robe
                new(35209, RaidDifficultiesLegacy25Normal), // Plans: Hard Khorium Battlefists
                new(35211, RaidDifficultiesLegacy25Normal), // Plans: Hard Khorium Battleplate
                new(35210, RaidDifficultiesLegacy25Normal), // Plans: Sunblessed Breastplate
                new(35208, RaidDifficultiesLegacy25Normal), // Plans: Sunblessed Gauntlets
                new(35186, RaidDifficultiesLegacy25Normal), // Schematic: Annihilator Holo-Gogs
                new(35196, RaidDifficultiesLegacy25Normal), // Schematic: Hard Khorium Goggles
                new(35190, RaidDifficultiesLegacy25Normal), // Schematic: Hyper-Magnified Moon Specs
                new(35187, RaidDifficultiesLegacy25Normal), // Schematic: Justicebringer 3000 Specs
                new(35193, RaidDifficultiesLegacy25Normal), // Schematic: Lightning Etched Specs
                new(35195, RaidDifficultiesLegacy25Normal), // Schematic: Mayhem Projection Goggles
                new(35189, RaidDifficultiesLegacy25Normal), // Schematic: Powerheal 9000 Lens
                new(35192, RaidDifficultiesLegacy25Normal), // Schematic: Primal-Attuned Goggles
                new(35197, RaidDifficultiesLegacy25Normal), // Schematic: Quad Deathblow X44 Goggles
                new(35194, RaidDifficultiesLegacy25Normal), // Schematic: Surestrike Goggles v3.0
                new(35191, RaidDifficultiesLegacy25Normal), // Schematic: Wonderheal XT68 Shades
                new(35273, RaidDifficultiesLegacy25Normal), // Study of Advanced Smelting

                new(34351, RaidDifficultiesLegacy25Normal), // Tranquil Majesty Wraps
                new(34407, RaidDifficultiesLegacy25Normal), // Tranquil Moonlight Wraps
                // Mail
                new(34350, RaidDifficultiesLegacy25Normal), // Gauntlets of the Ancient Shadowmoon
                new(34409, RaidDifficultiesLegacy25Normal), // Gauntlets of the Ancient Frostwolf
                // Weapon
                new(34346, RaidDifficultiesLegacy25Normal), // Mounting Vengeance
                new(34183, RaidDifficultiesLegacy25Normal), // Shivering Felspine
                new(34348, RaidDifficultiesLegacy25Normal), // Wand of Cleansing Light
                new(34347, RaidDifficultiesLegacy25Normal), // Wand of the Demonsoul
            ]
        },

        #endregion

        #region Wrath of the Lich King

        // Icecrown Citadel > Sanctified T10
        {
            1_0758_0,
            [
                new(51160, RaidDifficultiesLegacy10Heroic),
                new(51161, RaidDifficultiesLegacy10Heroic),
                new(51162, RaidDifficultiesLegacy10Heroic),
                new(51163, RaidDifficultiesLegacy10Heroic),
                new(51164, RaidDifficultiesLegacy10Heroic),
                new(51165, RaidDifficultiesLegacy10Heroic),
                new(51166, RaidDifficultiesLegacy10Heroic),
                new(51167, RaidDifficultiesLegacy10Heroic),
                new(51168, RaidDifficultiesLegacy10Heroic),
                new(51169, RaidDifficultiesLegacy10Heroic),
                new(51170, RaidDifficultiesLegacy10Heroic),
                new(51171, RaidDifficultiesLegacy10Heroic),
                new(51172, RaidDifficultiesLegacy10Heroic),
                new(51173, RaidDifficultiesLegacy10Heroic),
                new(51174, RaidDifficultiesLegacy10Heroic),
                new(51175, RaidDifficultiesLegacy10Heroic),
                new(51176, RaidDifficultiesLegacy10Heroic),
                new(51177, RaidDifficultiesLegacy10Heroic),
                new(51178, RaidDifficultiesLegacy10Heroic),
                new(51179, RaidDifficultiesLegacy10Heroic),
                new(51180, RaidDifficultiesLegacy10Heroic),
                new(51181, RaidDifficultiesLegacy10Heroic),
                new(51182, RaidDifficultiesLegacy10Heroic),
                new(51183, RaidDifficultiesLegacy10Heroic),
                new(51184, RaidDifficultiesLegacy10Heroic),
                new(51205, RaidDifficultiesLegacy10Heroic),
                new(51206, RaidDifficultiesLegacy10Heroic),
                new(51207, RaidDifficultiesLegacy10Heroic),
                new(51208, RaidDifficultiesLegacy10Heroic),
                new(51209, RaidDifficultiesLegacy10Heroic),

                // Conqueror's Mark of Sanctification [25H]
                new(51230, RaidDifficultiesLegacy25Heroic),
                new(51231, RaidDifficultiesLegacy25Heroic),
                new(51232, RaidDifficultiesLegacy25Heroic),
                new(51233, RaidDifficultiesLegacy25Heroic),
                new(51234, RaidDifficultiesLegacy25Heroic),
                new(51255, RaidDifficultiesLegacy25Heroic),
                new(51256, RaidDifficultiesLegacy25Heroic),
                new(51257, RaidDifficultiesLegacy25Heroic),
                new(51258, RaidDifficultiesLegacy25Heroic),
                new(51259, RaidDifficultiesLegacy25Heroic),
                new(51260, RaidDifficultiesLegacy25Heroic),
                new(51261, RaidDifficultiesLegacy25Heroic),
                new(51262, RaidDifficultiesLegacy25Heroic),
                new(51263, RaidDifficultiesLegacy25Heroic),
                new(51264, RaidDifficultiesLegacy25Heroic),
                new(51265, RaidDifficultiesLegacy25Heroic),
                new(51266, RaidDifficultiesLegacy25Heroic),
                new(51267, RaidDifficultiesLegacy25Heroic),
                new(51268, RaidDifficultiesLegacy25Heroic),
                new(51269, RaidDifficultiesLegacy25Heroic),
                new(51270, RaidDifficultiesLegacy25Heroic),
                new(51271, RaidDifficultiesLegacy25Heroic),
                new(51272, RaidDifficultiesLegacy25Heroic),
                new(51273, RaidDifficultiesLegacy25Heroic),
                new(51274, RaidDifficultiesLegacy25Heroic),
                new(51275, RaidDifficultiesLegacy25Heroic),
                new(51276, RaidDifficultiesLegacy25Heroic),
                new(51277, RaidDifficultiesLegacy25Heroic),
                new(51278, RaidDifficultiesLegacy25Heroic),
                new(51279, RaidDifficultiesLegacy25Heroic),

                // Protector's Mark of Sanctification [10H]
                new(51150, RaidDifficultiesLegacy10Heroic),
                new(51151, RaidDifficultiesLegacy10Heroic),
                new(51152, RaidDifficultiesLegacy10Heroic),
                new(51153, RaidDifficultiesLegacy10Heroic),
                new(51154, RaidDifficultiesLegacy10Heroic),
                new(51190, RaidDifficultiesLegacy10Heroic),
                new(51191, RaidDifficultiesLegacy10Heroic),
                new(51192, RaidDifficultiesLegacy10Heroic),
                new(51193, RaidDifficultiesLegacy10Heroic),
                new(51194, RaidDifficultiesLegacy10Heroic),
                new(51195, RaidDifficultiesLegacy10Heroic),
                new(51196, RaidDifficultiesLegacy10Heroic),
                new(51197, RaidDifficultiesLegacy10Heroic),
                new(51198, RaidDifficultiesLegacy10Heroic),
                new(51199, RaidDifficultiesLegacy10Heroic),
                new(51200, RaidDifficultiesLegacy10Heroic),
                new(51201, RaidDifficultiesLegacy10Heroic),
                new(51202, RaidDifficultiesLegacy10Heroic),
                new(51203, RaidDifficultiesLegacy10Heroic),
                new(51204, RaidDifficultiesLegacy10Heroic),
                new(51210, RaidDifficultiesLegacy10Heroic),
                new(51211, RaidDifficultiesLegacy10Heroic),
                new(51212, RaidDifficultiesLegacy10Heroic),
                new(51213, RaidDifficultiesLegacy10Heroic),
                new(51214, RaidDifficultiesLegacy10Heroic),
                new(51215, RaidDifficultiesLegacy10Heroic),
                new(51216, RaidDifficultiesLegacy10Heroic),
                new(51217, RaidDifficultiesLegacy10Heroic),
                new(51218, RaidDifficultiesLegacy10Heroic),
                new(51219, RaidDifficultiesLegacy10Heroic),

                // Protector's Mark of Sanctification [25H]
                new(51220, RaidDifficultiesLegacy25Heroic),
                new(51221, RaidDifficultiesLegacy25Heroic),
                new(51222, RaidDifficultiesLegacy25Heroic),
                new(51223, RaidDifficultiesLegacy25Heroic),
                new(51224, RaidDifficultiesLegacy25Heroic),
                new(51225, RaidDifficultiesLegacy25Heroic),
                new(51226, RaidDifficultiesLegacy25Heroic),
                new(51227, RaidDifficultiesLegacy25Heroic),
                new(51228, RaidDifficultiesLegacy25Heroic),
                new(51229, RaidDifficultiesLegacy25Heroic),
                new(51235, RaidDifficultiesLegacy25Heroic),
                new(51236, RaidDifficultiesLegacy25Heroic),
                new(51237, RaidDifficultiesLegacy25Heroic),
                new(51238, RaidDifficultiesLegacy25Heroic),
                new(51239, RaidDifficultiesLegacy25Heroic),
                new(51240, RaidDifficultiesLegacy25Heroic),
                new(51241, RaidDifficultiesLegacy25Heroic),
                new(51242, RaidDifficultiesLegacy25Heroic),
                new(51243, RaidDifficultiesLegacy25Heroic),
                new(51244, RaidDifficultiesLegacy25Heroic),
                new(51245, RaidDifficultiesLegacy25Heroic),
                new(51246, RaidDifficultiesLegacy25Heroic),
                new(51247, RaidDifficultiesLegacy25Heroic),
                new(51248, RaidDifficultiesLegacy25Heroic),
                new(51249, RaidDifficultiesLegacy25Heroic),
                new(51285, RaidDifficultiesLegacy25Heroic),
                new(51286, RaidDifficultiesLegacy25Heroic),
                new(51287, RaidDifficultiesLegacy25Heroic),
                new(51288, RaidDifficultiesLegacy25Heroic),
                new(51289, RaidDifficultiesLegacy25Heroic),

                // Vanquisher's Mark of Sanctification [10H]
                new(51125, RaidDifficultiesLegacy10Heroic),
                new(51126, RaidDifficultiesLegacy10Heroic),
                new(51127, RaidDifficultiesLegacy10Heroic),
                new(51128, RaidDifficultiesLegacy10Heroic),
                new(51129, RaidDifficultiesLegacy10Heroic),
                new(51130, RaidDifficultiesLegacy10Heroic),
                new(51131, RaidDifficultiesLegacy10Heroic),
                new(51132, RaidDifficultiesLegacy10Heroic),
                new(51133, RaidDifficultiesLegacy10Heroic),
                new(51134, RaidDifficultiesLegacy10Heroic),
                new(51135, RaidDifficultiesLegacy10Heroic),
                new(51136, RaidDifficultiesLegacy10Heroic),
                new(51137, RaidDifficultiesLegacy10Heroic),
                new(51138, RaidDifficultiesLegacy10Heroic),
                new(51139, RaidDifficultiesLegacy10Heroic),
                new(51140, RaidDifficultiesLegacy10Heroic),
                new(51141, RaidDifficultiesLegacy10Heroic),
                new(51142, RaidDifficultiesLegacy10Heroic),
                new(51143, RaidDifficultiesLegacy10Heroic),
                new(51144, RaidDifficultiesLegacy10Heroic),
                new(51145, RaidDifficultiesLegacy10Heroic),
                new(51146, RaidDifficultiesLegacy10Heroic),
                new(51147, RaidDifficultiesLegacy10Heroic),
                new(51148, RaidDifficultiesLegacy10Heroic),
                new(51149, RaidDifficultiesLegacy10Heroic),
                new(51155, RaidDifficultiesLegacy10Heroic),
                new(51156, RaidDifficultiesLegacy10Heroic),
                new(51157, RaidDifficultiesLegacy10Heroic),
                new(51158, RaidDifficultiesLegacy10Heroic),
                new(51159, RaidDifficultiesLegacy10Heroic),
                new(51185, RaidDifficultiesLegacy10Heroic),
                new(51186, RaidDifficultiesLegacy10Heroic),
                new(51187, RaidDifficultiesLegacy10Heroic),
                new(51188, RaidDifficultiesLegacy10Heroic),
                new(51189, RaidDifficultiesLegacy10Heroic),

                // Vanquisher's Mark of Sanctification [25H]
                new(51250, RaidDifficultiesLegacy25Heroic),
                new(51251, RaidDifficultiesLegacy25Heroic),
                new(51252, RaidDifficultiesLegacy25Heroic),
                new(51253, RaidDifficultiesLegacy25Heroic),
                new(51254, RaidDifficultiesLegacy25Heroic),
                new(51280, RaidDifficultiesLegacy25Heroic),
                new(51281, RaidDifficultiesLegacy25Heroic),
                new(51282, RaidDifficultiesLegacy25Heroic),
                new(51283, RaidDifficultiesLegacy25Heroic),
                new(51284, RaidDifficultiesLegacy25Heroic),
                new(51290, RaidDifficultiesLegacy25Heroic),
                new(51291, RaidDifficultiesLegacy25Heroic),
                new(51292, RaidDifficultiesLegacy25Heroic),
                new(51293, RaidDifficultiesLegacy25Heroic),
                new(51294, RaidDifficultiesLegacy25Heroic),
                new(51295, RaidDifficultiesLegacy25Heroic),
                new(51296, RaidDifficultiesLegacy25Heroic),
                new(51297, RaidDifficultiesLegacy25Heroic),
                new(51298, RaidDifficultiesLegacy25Heroic),
                new(51299, RaidDifficultiesLegacy25Heroic),
                new(51300, RaidDifficultiesLegacy25Heroic),
                new(51301, RaidDifficultiesLegacy25Heroic),
                new(51302, RaidDifficultiesLegacy25Heroic),
                new(51303, RaidDifficultiesLegacy25Heroic),
                new(51304, RaidDifficultiesLegacy25Heroic),
                new(51305, RaidDifficultiesLegacy25Heroic),
                new(51306, RaidDifficultiesLegacy25Heroic),
                new(51307, RaidDifficultiesLegacy25Heroic),
                new(51308, RaidDifficultiesLegacy25Heroic),
                new(51309, RaidDifficultiesLegacy25Heroic),
                new(51310, RaidDifficultiesLegacy25Heroic),
                new(51311, RaidDifficultiesLegacy25Heroic),
                new(51312, RaidDifficultiesLegacy25Heroic),
                new(51313, RaidDifficultiesLegacy25Heroic),
                new(51314, RaidDifficultiesLegacy25Heroic),
            ]
        },

        #endregion

        #region Wrath of the Lich King Trash

        // Ulduar > Trash
        {
            1000759,
            [
                new(45549, RaidDifficultiesNormal), // Grips of Chaos
                new(46344, RaidDifficultiesNormal), // Iceshear Mantle
                // Leather
                new(45548, RaidDifficultiesNormal), // Belt of the Sleeper
                new(45547, RaidDifficultiesNormal), // Relic Hunter's Cord
                // Mail
                new(46346, RaidDifficultiesNormal), // Boots of Unsettled Prey
                new(45544, RaidDifficultiesNormal), // Leggings of the Tortured Earth
                new(45543, RaidDifficultiesNormal), // Shoulders of Misfortune
                // Plate
                new(46345, RaidDifficultiesNormal), // Bracers of Righteous Reformation
                new(46340, RaidDifficultiesNormal), // Adamant Handguards
                new(45542, RaidDifficultiesNormal), // Greaves of the Stonewarder
                // Cloak
                new(46347, RaidDifficultiesNormal), // Cloak of the Dormant Blaze
                new(46341, RaidDifficultiesNormal), // Drape of the Spellweaver
                new(45541, RaidDifficultiesNormal), // Shroud of Alteration
                // Weapon
                new(46351, RaidDifficultiesNormal), // Bloodcrush Cudgel
                new(45605, RaidDifficultiesNormal), // Daschal's Bite
                new(46342, RaidDifficultiesNormal), // Golemheart Longbow
                new(46339, RaidDifficultiesNormal), // Mimiron's Repeater
                new(46350, RaidDifficultiesNormal), // Pillar of Fortitude
            ]
        },
        // Ulduar > Shared Drops
        {
            2000759,
            [
                new(46017, RaidDifficultiesNormal), // Val'anyr, Hammer of Ancient Kings
                new(46027, RaidDifficultiesNormal), // Formula: Enchant Weapon - Blade Ward
                new(46348, RaidDifficultiesNormal), // Formula: Enchant Weapon - Blood Draining
                new(45100, RaidDifficultiesNormal), // Pattern: Belt of Arctic Life
                new(45094, RaidDifficultiesNormal), // Pattern: Belt of Dragons
                new(45096, RaidDifficultiesNormal), // Pattern: Blue Belt of Chaos
                new(45095, RaidDifficultiesNormal), // Pattern: Boots of Living Scale
                new(45101, RaidDifficultiesNormal), // Pattern: Boots of Wintry Endurance
                new(45104, RaidDifficultiesNormal), // Pattern: Cord of the White Dawn
                new(45098, RaidDifficultiesNormal), // Pattern: Death-Warmed Belt
                new(45099, RaidDifficultiesNormal), // Pattern: Footpads of Silence
                new(45097, RaidDifficultiesNormal), // Pattern: Lightning Grounded Boots
                new(45102, RaidDifficultiesNormal), // Pattern: Sash of Ancient Power
                new(45105, RaidDifficultiesNormal), // Pattern: Savior's Slippers
                new(45103, RaidDifficultiesNormal), // Pattern: Spellslinger's Slippers
                new(45089, RaidDifficultiesNormal), // Plans: Battlelord's Plate Boots
                new(45088, RaidDifficultiesNormal), // Plans: Belt of the Titans
                new(45092, RaidDifficultiesNormal), // Plans: Indestructible Plate Girdle
                new(45090, RaidDifficultiesNormal), // Plans: Plate Girdle of Righteousness
                new(45093, RaidDifficultiesNormal), // Plans: Spiked Deathdealers
                new(45091, RaidDifficultiesNormal), // Plans: Treads of Destiny
            ]
        },
        // Trial of the Crusader > Shared Drops
        {
            2000757,
            [
                // Blacksmithing
                new(47622, RaidDifficultiesTrialRecipes), // Plans: Breastplate of the White Knight [A]
                new(47640, RaidDifficultiesTrialRecipes), // Plans: Breastplate of the White Knight [H]
                new(47623, RaidDifficultiesTrialRecipes), // Plans: Saronite Swordbreakers [A]
                new(47641, RaidDifficultiesTrialRecipes), // Plans: Saronite Swordbreakers [H]
                new(47627, RaidDifficultiesTrialRecipes), // Plans: Sunforged Bracers [A]
                new(47642, RaidDifficultiesTrialRecipes), // Plans: Sunforged Bracers [H]
                new(47626, RaidDifficultiesTrialRecipes), // Plans: Sunforged Breastplate [A]
                new(47643, RaidDifficultiesTrialRecipes), // Plans: Sunforged Breastplate [H]
                new(47624, RaidDifficultiesTrialRecipes), // Plans: Titanium Razorplate [A]
                new(47644, RaidDifficultiesTrialRecipes), // Plans: Titanium Razorplate [H]
                new(47625, RaidDifficultiesTrialRecipes), // Plans: Titanium Spikeguards [A]
                new(47645, RaidDifficultiesTrialRecipes), // Plans: Titanium Spikeguards [H]
                // Leatherworking
                new(47629, RaidDifficultiesTrialRecipes), // Pattern: Black Chitin Bracers [A]
                new(47646, RaidDifficultiesTrialRecipes), // Pattern: Black Chitin Bracers [H]
                new(47635, RaidDifficultiesTrialRecipes), // Pattern: Bracers of Swift Death [A]
                new(47647, RaidDifficultiesTrialRecipes), // Pattern: Bracers of Swift Death [H]
                new(47631, RaidDifficultiesTrialRecipes), // Pattern: Crusader's Dragonscale Bracers [A]
                new(47648, RaidDifficultiesTrialRecipes), // Pattern: Crusader's Dragonscale Bracers [H]
                new(47630, RaidDifficultiesTrialRecipes), // Pattern: Crusader's Dragonscale Breastplate [A]
                new(47649, RaidDifficultiesTrialRecipes), // Pattern: Crusader's Dragonscale Breastplate [H]
                new(47628, RaidDifficultiesTrialRecipes), // Pattern: Ensorcelled Nerubian Breastplate [A]
                new(47650, RaidDifficultiesTrialRecipes), // Pattern: Ensorcelled Nerubian Breastplate [H]
                new(47634, RaidDifficultiesTrialRecipes), // Pattern: Knightbane Carapace [A]
                new(47651, RaidDifficultiesTrialRecipes), // Pattern: Knightbane Carapace [H]
                new(47632, RaidDifficultiesTrialRecipes), // Pattern: Lunar Eclipse Robes [A]
                new(47652, RaidDifficultiesTrialRecipes), // Pattern: Lunar Eclipse Robes [H]
                new(47633, RaidDifficultiesTrialRecipes), // Pattern: Moonshadow Armguards [A]
                new(47653, RaidDifficultiesTrialRecipes), // Pattern: Moonshadow Armguards [H]
                // Tailoring
                new(47654, RaidDifficultiesTrialRecipes), // Pattern: Bejeweled Wizard's Bracers [A]
                new(47639, RaidDifficultiesTrialRecipes), // Pattern: Bejeweled Wizard's Bracers [H]
                new(47655, RaidDifficultiesTrialRecipes), // Pattern: Merlin's Robe [A]
                new(47638, RaidDifficultiesTrialRecipes), // Pattern: Merlin's Robe [H]
                new(47656, RaidDifficultiesTrialRecipes), // Pattern: Royal Moonshroud Bracers [A]
                new(47637, RaidDifficultiesTrialRecipes), // Pattern: Royal Moonshroud Bracers [H]
                new(47657, RaidDifficultiesTrialRecipes), // Pattern: Royal Moonshroud Robe [A]
                new(47636, RaidDifficultiesTrialRecipes), // Pattern: Royal Moonshroud Robe [H]

                new(47242, RaidDifficultiesTrialRecipes), // Trophy of the Crusade
            ]
        },
        // Icecrown Citadel > Trash
        {
            1000758,
            [
                new(50449, RaidDifficultiesLegacy25Normal), // Stiffened Corpse Shoulderpads
                // Mail
                new(50450, RaidDifficultiesLegacy25Normal), // Leggings of Dubious Charms
                // Plate
                new(50451, RaidDifficultiesLegacy25Normal), // Belt of the Lonely Noble
                // Weapon
                new(50444, RaidDifficultiesLegacy25Normal), // Rowan's Rifle of Silver Bullets
            ]
        },

        #endregion

        #region Cataclysm
        // Zul'Gurub > Jin'do the Godbreaker
        {
            185,
            [
            new(122215, DungeonDifficultiesHeroic), // Music Roll: Zul'Gurub Voodoo
            ]
        },
        // Zul'Gurub > Fishing Cache
        {
            1_0076_0,
            [
                new(19944, DungeonDifficultiesHeroic), // Nat Pagle's Fish Terminator [staff
                new(19945, DungeonDifficultiesHeroic), // Lizardscale Eyepatch [leather head]
                new(19946, DungeonDifficultiesHeroic), // Tigule's Harpoon [polearm]
                new(22739, DungeonDifficultiesHeroic), // Tome of Polymorph: Turtle
            ]
        },
        // Zul'Aman > Timed Run
        {
            1_0077_0,
            [
                // 2 chests
                new(69584, RaidDifficultiesHeroic), // Recovered Cloak of Frostheim
                new(69587, RaidDifficultiesHeroic), // Chestplate of Hubris
                new(69585, RaidDifficultiesHeroic), // Wristwraps of Madness
                new(69586, RaidDifficultiesHeroic), // Two-Toed Boots
                new(69588, RaidDifficultiesHeroic), // Skullcrusher Warboots
                // 3 chests
                new(69592, RaidDifficultiesHeroic), // Reforged Trollbane
                new(69591, RaidDifficultiesHeroic), // Voodoo Hexblade
                new(69593, RaidDifficultiesHeroic), // Battleplate of the Amani Empire
                new(69590, RaidDifficultiesHeroic), // Mojo-Mender's Gloves
                new(69589, RaidDifficultiesHeroic), // Leggings of Dancing Blades
                // 4 chests
                new(69747, RaidDifficultiesHeroic), // Amani Battle Bear
            ]
        },

        // Firelands > Vendor
        {
            1_0078_0,
            [
                new(71557, RaidDifficultiesHeroic), // Ranseur of Hatred (Upgraded)
                new(71558, RaidDifficultiesHeroic), // Lava Bolt Crossbow (Upgraded)
                new(71559, RaidDifficultiesHeroic), // Spire of Scarlet Pain (Upgraded)
                new(71560, RaidDifficultiesHeroic), // Chelley's Sterilized Scalpel (Upgraded)
                new(71561, RaidDifficultiesHeroic), // Hide-Bound Chains (Upgraded)
                new(71562, RaidDifficultiesHeroic), // Obsidium Cleaver (Upgraded)
                new(71575, RaidDifficultiesHeroic), // Trail of Embers (Upgraded)
                new(71579, RaidDifficultiesHeroic), // Scorchvine Wand (Upgraded)
                new(71641, RaidDifficultiesHeroic), // Riplimb's Lost Collar (Upgraded)
            ]
        },
        // Firelands > Shared Drops
        {
            2000078,
            [
                new(71084, RaidDifficultiesNormalHeroic), // Branch of Nordrassil
                new(71085, RaidDifficultiesNormalHeroic), // Runestaff of Nordrassil
                new(71086, RaidDifficultiesNormalHeroic), // Dragonwrath, Tarecgosa's Rest
            ]
        },
        // Firelands > Majordomo Staghelm
        {
            197,
            [
                new(122304, [14, 15, 33]), // Fandral's Seed Pouch
            ]
        },
        {
            198,
            [
                new(175158, RaidDifficultiesNormalHeroic), // Flames of Fury (Vulpera)
            ]
        },

        #endregion

        #region Cataclysm Trash

        {
            1000072, // The Bastion of Twilight > Trash
            [
                new(60211, RaidDifficultiesNormal), // Bracers of the Dark Pool
                new(60202, RaidDifficultiesNormal), // Tsanga's Helm
                new(60201, RaidDifficultiesNormal), // Phase-Twister Leggings
                new(59901, RaidDifficultiesNormal), // Heaving Plates of Protection
                new(59520, RaidDifficultiesNormal), // Unheeded Warning
                new(59521, RaidDifficultiesNormal), // Soul Blade
                new(59525, RaidDifficultiesNormal), // Chelley's Staff of Dark Mending
                new(60210, RaidDifficultiesNormal), // Crossfire Carbine
            ]
        },
        {
            1000077, // Zul'Aman > Trash
            [
                new(69801, RaidDifficultiesLegacy1025), // Amani Armguards
                new(69797, RaidDifficultiesLegacy1025), // Charmbinder Grips
                new(69803, RaidDifficultiesLegacy1025), // Gurubashi Punisher
                new(69798, RaidDifficultiesLegacy1025), // Knotted Handwraps
            ]
        },
        {
            1000078, // Firelands > Trash
            [
                new(69976, RaidDifficultiesNormalHeroic), // Pattern: Boots of the Black Flame
                new(69966, RaidDifficultiesNormalHeroic), // Pattern: Don Tayo's Inferno Mittens
                new(69975, RaidDifficultiesNormalHeroic), // Pattern: Endless Dream  Walkers
                new(69965, RaidDifficultiesNormalHeroic), // Pattern: Grips of Altered Reality
                new(69962, RaidDifficultiesNormalHeroic), // Pattern: Clutches of Evil
                new(69960, RaidDifficultiesNormalHeroic), // Pattern: Dragonfire Gloves
                new(69971, RaidDifficultiesNormalHeroic), // Pattern: Earthen Scale Sabatons
                new(69974, RaidDifficultiesNormalHeroic), // Pattern: Ethereal Footfalls
                new(69972, RaidDifficultiesNormalHeroic), // Pattern: Footwraps of Quenched Fire
                new(69961, RaidDifficultiesNormalHeroic), // Pattern: Gloves of Unforgiving Flame
                new(69963, RaidDifficultiesNormalHeroic), // Pattern: Heavenly Gloves of the Moon
                new(69973, RaidDifficultiesNormalHeroic), // Pattern: Treads of the Craft
                new(69970, RaidDifficultiesNormalHeroic), // Plans: Emberforged Elementium Boots
                new(69969, RaidDifficultiesNormalHeroic), // Plans: Mirrored Boots
                new(69968, RaidDifficultiesNormalHeroic), // Plans: Warboots of Mighty Lords
                new(69958, RaidDifficultiesNormalHeroic), // Plans: Eternal Elementium Handguards
                new(69957, RaidDifficultiesNormalHeroic), // Plans: Fists of Fury
                new(69959, RaidDifficultiesNormalHeroic), // Plans: Holy Flame Gauntlets

                new(71640, RaidDifficultiesNormal), // Riplimb's Lost Collar
                // Mail
                new(71365, RaidDifficultiesNormal), // Hide-Bound Chains
                // Weapon
                new(71359, RaidDifficultiesNormal), // Chelley's Sterilized Scalpel
                new(71366, RaidDifficultiesNormal), // Lava Bolt Crossbow
                new(71362, RaidDifficultiesNormal), // Obsidium Cleaver
                new(71361, RaidDifficultiesNormal), // Ranseur of Hatred
                new(71360, RaidDifficultiesNormal), // Spire of Scarlet Pain
            ]
        },
        {
            1000187, // Dragon Soul > Trash
            [
                new(72006, RaidDifficultiesNormalHeroic), // Pattern: Bladeshadow Leggings
                new(72010, RaidDifficultiesNormalHeroic), // Pattern: Bladeshadow Wristguards
                new(72008, RaidDifficultiesNormalHeroic), // Pattern: Bracers of Flowing Serenity
                new(72011, RaidDifficultiesNormalHeroic), // Pattern: Bracers of the Hunter-Killer
                new(72004, RaidDifficultiesNormalHeroic), // Pattern: Bracers of Unconquered Power
                new(72005, RaidDifficultiesNormalHeroic), // Pattern: Deathscale Leggings
                new(72003, RaidDifficultiesNormalHeroic), // Pattern: Dreamwraps of the Light
                new(72002, RaidDifficultiesNormalHeroic), // Pattern: Lavaquake Legwraps
                new(71999, RaidDifficultiesNormalHeroic), // Pattern: Leggings of Nature's Champion
                new(72007, RaidDifficultiesNormalHeroic), // Pattern: Rended Earth Leggings
                new(72009, RaidDifficultiesNormalHeroic), // Pattern: Thundering Deathscale Wristguards
                new(72000, RaidDifficultiesNormalHeroic), // Pattern: World Mender's Pants
                new(72015, RaidDifficultiesNormalHeroic), // Plans: Bracers of Destructive Strength
                new(72013, RaidDifficultiesNormalHeroic), // Plans: Foundations of Courage
                new(72001, RaidDifficultiesNormalHeroic), // Plans: Pyrium Legplates of Purified Evil
                new(72014, RaidDifficultiesNormalHeroic), // Plans: Soul Redeemer Bracers
                new(72016, RaidDifficultiesNormalHeroic), // Plans: Titanguard Wristplates
                new(72012, RaidDifficultiesNormalHeroic), // Plans: Unstoppable Destroyer's Legplates
                // Cloth
                new(78879, RaidDifficultiesNormalHeroic), // Sash of Relentless Truth
                // Leather
                new(78884, RaidDifficultiesNormalHeroic), // Girdle of Fungal Dreams
                new(78882, RaidDifficultiesNormalHeroic), // Nightblind Cinch
                // Mail
                new(78886, RaidDifficultiesNormalHeroic), // Belt of Ghostly Graces
                new(78885, RaidDifficultiesNormalHeroic), // Dragoncarver Belt
                // Plate
                new(78887, RaidDifficultiesNormalHeroic), // Girdle of Soulful Mending
                new(78888, RaidDifficultiesNormalHeroic), // Waistguard of Bleeding Bone
                new(78889, RaidDifficultiesNormalHeroic), // Waistplate of the Desecrated Future
                // Weapon
                new(77938, RaidDifficultiesNormalHeroic), // Dragonfire Orb
                new(77192, RaidDifficultiesNormalHeroic), // Ruinblaster Shotgun
                new(78878, RaidDifficultiesNormalHeroic), // Spine of the Thousand Cuts
            ]
        },

        #endregion

        #region Mists of Pandaria

        // Scholomance > Doctor Theolen Krastinov
        {
            1_0246_0,
            [
                new(88566, DungeonDifficultiesHeroic), // Krastinov's Bag of Horrors - Heroic
            ]
        },
        // Throne of Thunder > Shared Boss Drops
        {
            1_0362_0,
            [
                new(95870, RaidDifficultiesLegacyLfr), // Abandoned Spaulders of Arrowflight [L]
                new(95871, RaidDifficultiesLegacyLfr), // Abandoned Spaulders of Renewal [L]
                new(95877, RaidDifficultiesLegacyLfr), // Bo-Ris, Horror in the Night [L]
                new(95862, RaidDifficultiesLegacyLfr), // Darkwood Spiritstaff [L]
                new(95876, RaidDifficultiesLegacyLfr), // Do-tharak, the Swordbreaker [L]
                new(95868, RaidDifficultiesLegacyLfr), // Forgotten Mantle of the Moon [L]
                new(95869, RaidDifficultiesLegacyLfr), // Forgotten Mantle of the Sun [L]
                new(95860, RaidDifficultiesLegacyLfr), // Fyn's Flickering Dagger [L]
                new(95875, RaidDifficultiesLegacyLfr), // Greatsword of Frozen Hells [L]
                new(95858, RaidDifficultiesLegacyLfr), // Invocation of the Dawn [L]
                new(95867, RaidDifficultiesLegacyLfr), // Jerthud, Graceful Hand of the Savior [L]
                new(95863, RaidDifficultiesLegacyLfr), // Lost Shoulders of Fire [L]
                new(95864, RaidDifficultiesLegacyLfr), // Lost Shoulders of Healing [L]
                new(95865, RaidDifficultiesLegacyLfr), // Lost Shoulders of Fluidity [L]
                new(95859, RaidDifficultiesLegacyLfr), // Miracoran, the Vehement Chord [L]
                new(95866, RaidDifficultiesLegacyLfr), // Nadagast's Exsanguinator [L]
                new(95872, RaidDifficultiesLegacyLfr), // Reconstructed Holy Shoulderplates [L]
                new(95873, RaidDifficultiesLegacyLfr), // Reconstructed Furious Shoulderplates [L]
                new(95874, RaidDifficultiesLegacyLfr), // Reconstructed Bloody Shoulderplates [L]
                new(97129, RaidDifficultiesLegacyLfr), // Tia-Tia, the Scything Star [L]
                new(95878, RaidDifficultiesLegacyLfr), // Visage of the Doomed [L]
                new(95861, RaidDifficultiesLegacyLfr), // Zeeg's Ancient Kegsmasher [L]

                new(95060, RaidDifficultiesNormal), // Abandoned Spaulders of Arrowflight [N]
                new(95064, RaidDifficultiesNormal), // Abandoned Spaulders of Renewal [N]
                new(95498, RaidDifficultiesNormal), // Bo-Ris, Horror in the Night [N]
                new(95507, RaidDifficultiesNormal), // Darkwood Spiritstaff [N]
                new(95502, RaidDifficultiesNormal), // Do-tharak, the Swordbreaker [N]
                new(95062, RaidDifficultiesNormal), // Forgotten Mantle of the Sun [N]
                new(95065, RaidDifficultiesNormal), // Forgotten Mantle of the Moon [N]
                new(95501, RaidDifficultiesNormal), // Fyn's Flickering Dagger [N]
                new(95505, RaidDifficultiesNormal), // Greatsword of Frozen Hells [N]
                new(95499, RaidDifficultiesNormal), // Invocation of the Dawn [N]
                new(95500, RaidDifficultiesNormal), // Jerthud, Graceful Hand of the Savior [N]
                new(95061, RaidDifficultiesNormal), // Lost Shoulders of Fire [N]
                new(95066, RaidDifficultiesNormal), // Lost Shoulders of Healing [N]
                new(95067, RaidDifficultiesNormal), // Lost Shoulders of Fluidity [N]
                new(95503, RaidDifficultiesNormal), // Miracoran, the Vehement Chord [N]
                new(95506, RaidDifficultiesNormal), // Nadagast's Exsanguinator [N]
                new(95063, RaidDifficultiesNormal), // Reconstructed Furious Shoulderplates [N]
                new(95068, RaidDifficultiesNormal), // Reconstructed Bloody Shoulderplates [N]
                new(95069, RaidDifficultiesNormal), // Reconstructed Holy Shoulderplates [N]
                new(97126, RaidDifficultiesNormal), // Tia-Tia, the Scything Star [N]
                new(95516, RaidDifficultiesNormal), // Visage of the Doomed [N]
                new(95504, RaidDifficultiesNormal), // Zeeg's Ancient Kegsmasher [N]

                new(96242, RaidDifficultiesNormal), // Abandoned Spaulders of Arrowflight [N TF]
                new(96243, RaidDifficultiesNormal), // Abandoned Spaulders of Renewal [N TF]
                new(96249, RaidDifficultiesNormal), // Bo-Ris, Horror in the Night [N TF]
                new(96234, RaidDifficultiesNormal), // Darkwood Spiritstaff [N TF]
                new(96248, RaidDifficultiesNormal), // Do-tharak, the Swordbreaker [N TF]
                new(96240, RaidDifficultiesNormal), // Forgotten Mantle of the Moon [N TF]
                new(96241, RaidDifficultiesNormal), // Forgotten Mantle of the Sun [N TF]
                new(96232, RaidDifficultiesNormal), // Fyn's Flickering Dagger [N TF]
                new(96247, RaidDifficultiesNormal), // Greatsword of Frozen Hells [N TF]
                new(96230, RaidDifficultiesNormal), // Invocation of the Dawn [N TF]
                new(96239, RaidDifficultiesNormal), // Jerthud, Graceful Hand of the Savior [N TF]
                new(96235, RaidDifficultiesNormal), // Lost Shoulders of Fire [N TF]
                new(96236, RaidDifficultiesNormal), // Lost Shoulders of Healing [N TF]
                new(96237, RaidDifficultiesNormal), // Lost Shoulders of Fluidity [N TF]
                new(96231, RaidDifficultiesNormal), // Miracoran, the Vehement Chord [N TF]
                new(96238, RaidDifficultiesNormal), // Nadagast's Exsanguinator [N TF]
                new(96244, RaidDifficultiesNormal), // Reconstructed Holy Shoulderplates [N TF]
                new(96245, RaidDifficultiesNormal), // Reconstructed Furious Shoulderplates [N TF]
                new(96246, RaidDifficultiesNormal), // Reconstructed Bloody Shoulderplates [N TF]
                new(97128, RaidDifficultiesNormal), // Tia-Tia, the Scything Star [N TF]
                new(96250, RaidDifficultiesNormal), // Visage of the Doomed [N TF]
                new(96233, RaidDifficultiesNormal), // Zeeg's Ancient Kegsmasher [N TF]

                new(96614, RaidDifficultiesHeroic), // Abandoned Spaulders of Arrowflight [H]
                new(96615, RaidDifficultiesHeroic), // Abandoned Spaulders of Renewal [H]
                new(96621, RaidDifficultiesHeroic), // Bo-Ris, Horror in the Night [H]
                new(96606, RaidDifficultiesHeroic), // Darkwood Spiritstaff [H]
                new(96620, RaidDifficultiesHeroic), // Do-tharak, the Swordbreaker [H]
                new(96612, RaidDifficultiesHeroic), // Forgotten Mantle of the Moon [H]
                new(96613, RaidDifficultiesHeroic), // Forgotten Mantle of the Sun [H]
                new(96604, RaidDifficultiesHeroic), // Fyn's Flickering Dagger [H]
                new(96619, RaidDifficultiesHeroic), // Greatsword of Frozen Hells [H]
                new(96602, RaidDifficultiesHeroic), // Invocation of the Dawn [H]
                new(96611, RaidDifficultiesHeroic), // Jerthud, Graceful Hand of the Savior [H]
                new(96607, RaidDifficultiesHeroic), // Lost Shoulders of Fire [H]
                new(96608, RaidDifficultiesHeroic), // Lost Shoulders of Healing [H]
                new(96609, RaidDifficultiesHeroic), // Lost Shoulders of Fluidity [H]
                new(96603, RaidDifficultiesHeroic), // Miracoran, the Vehement Chord [H]
                new(96610, RaidDifficultiesHeroic), // Nadagast's Exsanguinator [H]
                new(96616, RaidDifficultiesHeroic), // Reconstructed Holy Shoulderplates [H]
                new(96617, RaidDifficultiesHeroic), // Reconstructed Furious Shoulderplates [H]
                new(96618, RaidDifficultiesHeroic), // Reconstructed Bloody Shoulderplates [H]
                new(97127, RaidDifficultiesHeroic), // Tia-Tia, the Scything Star [H]
                new(96622, RaidDifficultiesHeroic), // Visage of the Doomed [H]
                new(96605, RaidDifficultiesHeroic), // Zeeg's Ancient Kegsmasher [H]

                new(96986, RaidDifficultiesHeroic), // Abandoned Spaulders of Arrowflight [H TF]
                new(96987, RaidDifficultiesHeroic), // Abandoned Spaulders of Renewal [H TF]
                new(96993, RaidDifficultiesHeroic), // Bo-Ris, Horror in the Night [H TF]
                new(96978, RaidDifficultiesHeroic), // Darkwood Spiritstaff [H TF]
                new(96992, RaidDifficultiesHeroic), // Do-tharak, the Swordbreaker [H TF]
                new(96984, RaidDifficultiesHeroic), // Forgotten Mantle of the Moon [H TF]
                new(96985, RaidDifficultiesHeroic), // Forgotten Mantle of the Sun [H TF]
                new(96976, RaidDifficultiesHeroic), // Fyn's Flickering Dagger [H TF]
                new(96991, RaidDifficultiesHeroic), // Greatsword of Frozen Hells [H TF]
                new(96974, RaidDifficultiesHeroic), // Invocation of the Dawn [H TF]
                new(96983, RaidDifficultiesHeroic), // Jerthud, Graceful Hand of the Savior [H TF]
                new(96979, RaidDifficultiesHeroic), // Lost Shoulders of Fire [H TF]
                new(96980, RaidDifficultiesHeroic), // Lost Shoulders of Healing [H TF]
                new(96981, RaidDifficultiesHeroic), // Lost Shoulders of Fluidity [H TF]
                new(96975, RaidDifficultiesHeroic), // Miracoran, the Vehement Chord [H TF]
                new(96982, RaidDifficultiesHeroic), // Nadagast's Exsanguinator [H TF]
                new(96988, RaidDifficultiesHeroic), // Reconstructed Holy Shoulderplates [H TF]
                new(96989, RaidDifficultiesHeroic), // Reconstructed Furious Shoulderplates [H TF]
                new(96990, RaidDifficultiesHeroic), // Reconstructed Bloody Shoulderplates [H TF]
                new(97130, RaidDifficultiesHeroic), // Tia-Tia, the Scything Star [H TF]
                new(96994, RaidDifficultiesHeroic), // Visage of the Doomed [H TF]
                new(96977, RaidDifficultiesHeroic), // Zeeg's Ancient Kegsmasher [H TF]
            ]
        },
        // Siege of Orgrimmar > Garrosh Hellscream
        {
            869,
            [
                new(112935, [15, 16]), // Tusks of Mannoroth - Heroic/Mythic
            ]
        },
        // World Bosses > Salyis's Warband (Galleon)
        {
            725,
            [
                new(86884, RaidDifficultiesNormal), // Belt of Embodied Terror [waist]
                new(86895, RaidDifficultiesNormal), // Healer's Belt of Final Winter [waist]
                new(86896, RaidDifficultiesNormal), // Invoker's Belt of Final Winter [waist]
                new(86897, RaidDifficultiesNormal), // Sorcerer's Belt of Final Winter [waist]
                new(86850, RaidDifficultiesNormal), // Darting Damselfly Cuffs [wrists]
                new(86844, RaidDifficultiesNormal), // Gleaming Moth Cuffs [wrists]
                new(86841, RaidDifficultiesNormal), // Shining Cicada Bracers [wrists]

                // Leather
                new(86899, RaidDifficultiesNormal), // Stalker's Cord of Eternal Autumn [waist]
                new(86898, RaidDifficultiesNormal), // Weaver's Cord of Eternal Autumn [waist]
                new(86845, RaidDifficultiesNormal), // Pearlescent Butterfly Wristbands [wrists]
                new(86843, RaidDifficultiesNormal), // Smooth Beetle Wristbands [wrists]

                // Mail
                new(86900, RaidDifficultiesNormal), // Binder's Chain of Unending Summer [waist]
                new(86904, RaidDifficultiesNormal), // Patroller's Girdle of Endless Spring [waist]
                new(86847, RaidDifficultiesNormal), // Jagged Hornet Bracers [wrists]
                new(86842, RaidDifficultiesNormal), // Luminescent Firefly Wristguards [wrists]

                // Plate
                new(86902, RaidDifficultiesNormal), // Mender's Girdle of Endless Spring [waist]
                new(86903, RaidDifficultiesNormal), // Protector's Girdle of Endless Spring [waist]
                new(86901, RaidDifficultiesNormal), // Ranger's Chain of Unending Summer [waist]
                new(86846, RaidDifficultiesNormal), // Inlaid Cricket Bracers [wrists]
                new(86849, RaidDifficultiesNormal), // Plated Locust Bracers [wrists]
                new(86848, RaidDifficultiesNormal), // Serrated Wasp Bracers [wrists]
            ]
        },

        #endregion

        #region Mists of Pandaria Trash

        // Mogu'shan Vaults > Trash Drops
        {
            1000317,
            Tier14Recipes
        },
        // Terrace of Endless Spring > Trash Drops
        {
            1000320,
            Tier14Recipes
        },
        {
            1000330, // Heart of Fear > Trash
            Tier14Recipes.Concat([
                new(86850, RaidDifficultiesLegacyLfr), // Darting Damselfly Cuffs
                new(86192, RaidDifficultiesNormal), // Darting Damselfly Cuffs
                new(86844, RaidDifficultiesLegacyLfr), // Gleaming Moth Cuffs
                new(86186, RaidDifficultiesNormal), // Gleaming Moth Cuffs
                new(86841, RaidDifficultiesLegacyLfr), // Shining Cicada Bracers
                new(86183, RaidDifficultiesNormal), // Shining Cicada Bracers
                // Leather
                new(86845, RaidDifficultiesLegacyLfr), // Pearlescent Butterfly Wristbands
                new(86187, RaidDifficultiesNormal), // Pearlescent Butterfly Wristbands
                new(86843, RaidDifficultiesLegacyLfr), // Smooth Beetle Wristbands
                new(86185, RaidDifficultiesNormal), // Smooth Beetle Wristbands
                // Mail
                new(86847, RaidDifficultiesLegacyLfr), // Jagged Hornet Bracers
                new(86189, RaidDifficultiesNormal), // Jagged Hornet Bracers
                new(86842, RaidDifficultiesLegacyLfr), // Luminescent Firefly Wristguards
                new(86184, RaidDifficultiesNormal), // Luminescent Firefly Wristguards
                // Plate
                new(86846, RaidDifficultiesLegacyLfr), // Inlaid Cricket Bracers
                new(86188, RaidDifficultiesNormal), // Inlaid Cricket Bracers
                new(86849, RaidDifficultiesLegacyLfr), // Plated Locust Bracers
                new(86191, RaidDifficultiesNormal), // Plated Locust Bracers
                new(86848, RaidDifficultiesLegacyLfr), // Serrated Wasp Bracers
                new(86190, RaidDifficultiesNormal), // Serrated Wasp Bracers
            ]).ToList()
        },
        {
            1000362, // Throne of Thunder > Trash
            [
                new(98136, RaidDifficultiesLfrNormalHeroic), // Gastropod Shell
                // Cloth
                new(95207, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Firecord
                new(96333, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Firecord [TF]
                new(95208, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Shadowgirdle
                new(96334, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Shadowgirdle [TF]
                new(95224, RaidDifficultiesLfrNormalHeroic), // Home-Warding Slippers
                new(96337, RaidDifficultiesLfrNormalHeroic), // Home-Warding Slippers [TF]
                new(95223, RaidDifficultiesLfrNormalHeroic), // Silentflame Sandals
                new(96335, RaidDifficultiesLfrNormalHeroic), // Silentflame Sandals [TF]
                // Leather
                new(95210, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Moonstrap
                new(96343, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Moonstrap [TF]
                new(95209, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Silentbelt
                new(96342, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Silentbelt [TF]
                new(95221, RaidDifficultiesLfrNormalHeroic), // Deeproot Treads
                new(96338, RaidDifficultiesLfrNormalHeroic), // Deeproot Treads [TF]
                new(95219, RaidDifficultiesLfrNormalHeroic), // Spiderweb Tabi
                new(96331, RaidDifficultiesLfrNormalHeroic), // Spiderweb Tabi [TF]
                // Mail
                new(95211, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Arrowlinks
                new(96344, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Arrowlinks [TF]
                new(95212, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Waterchain
                new(96345, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Waterchain [TF]
                new(95220, RaidDifficultiesLfrNormalHeroic), // Scalehide Spurs
                new(96332, RaidDifficultiesLfrNormalHeroic), // Scalehide Spurs [TF]
                new(95222, RaidDifficultiesLfrNormalHeroic), // Spiritbound Boots
                new(96339, RaidDifficultiesLfrNormalHeroic), // Spiritbound Boots [TF]
                // Plate
                new(95215, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Bucklebreaker
                new(96348, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Bucklebreaker [TF]
                new(95214, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Goreplate
                new(96347, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Goreplate [TF]
                new(95213, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Greatbelt
                new(96346, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Greatbelt [TF]
                new(95218, RaidDifficultiesLfrNormalHeroic), // Columnbreaker Stompers
                new(96351, RaidDifficultiesLfrNormalHeroic), // Columnbreaker Stompers [TF]
                new(95217, RaidDifficultiesLfrNormalHeroic), // Locksmasher Greaves
                new(96350, RaidDifficultiesLfrNormalHeroic), // Locksmasher Greaves [TF]
                new(95216, RaidDifficultiesLfrNormalHeroic), // Vaultwalker Sabatons
                new(96340, RaidDifficultiesLfrNormalHeroic), // Vaultwalker Sabatons [TF]
            ]
        },
        {
            1000369, // Siege of Orgrimmar > Trash
            [
                new(113225, RaidDifficultiesAll), // Kalaena's Arcane Handwraps
                new(113218, RaidDifficultiesAll), // Seebo's Sainted Touch
                // Leather
                new(113220, RaidDifficultiesAll), // Crimson Gauntlets of Death
                new(113221, RaidDifficultiesAll), // Siid's Silent Stranglers
                // Mail
                new(113222, RaidDifficultiesAll), // Keengrip Arrowpullers
                new(113227, RaidDifficultiesAll), // Marco's Crackling Gloves
                // Plate
                new(113228, RaidDifficultiesAll), // Gauntlets of Discarded Time
                new(113219, RaidDifficultiesAll), // Romy's Reliable Grips
                new(113229, RaidDifficultiesAll), // Zoid's Molten Gauntlets
                // Cloak
                new(113224, RaidDifficultiesAll), // Aeth's Swiftcinder Cloak
                new(113231, RaidDifficultiesAll), // Brave Niunai's Cloak
                new(113226, RaidDifficultiesAll), // Cape of the Alpha
                new(113230, RaidDifficultiesAll), // Drape of the Omega
                new(113223, RaidDifficultiesAll), // Turtleshell Greatcloak
            ]
        },

        #endregion

        #region Warlords of Draenor Trash

        {
            1000477, // Highmaul > Trash
            [
                new(119336, RaidDifficultiesNoLfr), // Cord of Winsome Sorrows
                // Leather
                new(119335, RaidDifficultiesNoLfr), // Eyeripper Girdle
                // Mail
                new(119338, RaidDifficultiesNoLfr), // Belt of Inebriated Sorrows
                // Plate
                new(119337, RaidDifficultiesNoLfr), // Ripswallow Plate Belt
                // Cloak
                new(119343, RaidDifficultiesNoLfr), // Eye-Blinder Greatcloak
                new(119347, RaidDifficultiesNoLfr), // Gill's Glorious Windcloak
                new(119346, RaidDifficultiesNoLfr), // Kyu-Sy's Tarflame Doomcloak
                new(119344, RaidDifficultiesNoLfr), // Magic-Breaker Cape
                new(119345, RaidDifficultiesNoLfr), // Milenah's Intricate Cloak
            ]
        },
        {
            1000457, // Blackrock Foundry > Trash
            [
                new(119332, RaidDifficultiesNoLfr), // Bracers of Darkened Skies
                new(119342, RaidDifficultiesNoLfr), // Furnace Stoker's Footwraps
                // Leather
                new(119333, RaidDifficultiesNoLfr), // Bracers of Shattered Limbs
                new(119340, RaidDifficultiesNoLfr), // Iron-Flecked Sandals
                // Mail
                new(119334, RaidDifficultiesNoLfr), // Bracers of Callous Disregard
                new(119339, RaidDifficultiesNoLfr), // Treads of the Veteran Smith
                // Plate
                new(119331, RaidDifficultiesNoLfr), // Bracers of Visceral Force
                new(119341, RaidDifficultiesNoLfr), // Doomslag Greatboots
            ]
        },
        {
            1000669, // Hellfire Citadel > Trash
            [
                new(124182, RaidDifficultiesNoLfr), // Cord of Unhinged Malice
                new(124150, RaidDifficultiesNoLfr), // Desiccated Soulrender Slippers
                // Leather
                new(124277, RaidDifficultiesNoLfr), // Flayed Demonskin Belt
                new(124252, RaidDifficultiesNoLfr), // Jungle Assassin's Footpads
                // Mail
                new(124311, RaidDifficultiesNoLfr), // Cursed Demonchain Belt
                new(124288, RaidDifficultiesNoLfr), // Unhallowed Voidlink Boots
                // Plate
                new(124323, RaidDifficultiesNoLfr), // Cruel Hope Crushers
                new(124350, RaidDifficultiesNoLfr), // Girdle of Demonic Wrath
            ]
        },

        #endregion

        #region Legion

        // Assault on Violet Hold > Sael'orn
        {
            1697,
            [
                new(137824, DungeonDifficultiesNormalHeroicMythic), // Design: Maelstrom Band [Rank 2]
                new(137882, DungeonDifficultiesNormalHeroicMythic), // Pattern: Warhide Shoulderguard [Rank 3]
                new(136700, DungeonDifficultiesNormalHeroicMythic), // Schematic: "The Felic"
                new(140037, DungeonDifficultiesNormalHeroicMythic), // Technique: Unwritten Legend
            ]
        },
        // Assault on Violet Hold > Fel Lord Betrug
        {
            1711,
            [
                new(137824, DungeonDifficultiesNormalHeroicMythic), // Design: Maelstrom Band [Rank 2]
                new(137882, DungeonDifficultiesNormalHeroicMythic), // Pattern: Warhide Shoulderguard [Rank 3]
                new(136700, DungeonDifficultiesNormalHeroicMythic), // Schematic: "The Felic"
                new(140037, DungeonDifficultiesNormalHeroicMythic), // Technique: Unwritten Legend
            ]
        },
        // Black Rook Hold > Lord Kur'talos Ravencrest
        {
            1672,
            [
                new(137858, DungeonDifficultiesHeroicMythic), // Design: Grim Furystone Gorget [Rank 3]
                new(127930, DungeonDifficultiesHeroicMythic), // Recipe: Flask of the Whispered Pact [Rank 2]
                new(137931, DungeonDifficultiesMythic), // Pattern: Gravenscale Hauberk [Rank 3]
            ]
        },
        // Court of Stars > Advisor Melandrus
        {
            1720,
            [
                new(137856, DungeonDifficultiesHeroicMythic), // Design: Righteous Dawnlight Medallion [Rank 3]
                new(128594,
                    DungeonDifficultiesHeroicMythic), // Formula: Enchant Neck - Mark of the Distant Army [Rank 2]
                new(137929, DungeonDifficultiesHeroicMythic), // Pattern: Gravenscale Grips [Rank 3]
                new(127926, DungeonDifficultiesHeroicMythic), // Recipe: Potion of Deadly Grace [Rank 2]
            ]
        },
        // Darkheart Thicket > Archdruid Glaidalis
        {
            1654,
            [
                new(128595,
                    DungeonDifficultiesNormalHeroicMythic), // Formula: Enchant Neck - Mark of the Hidden Satyr [Rank 2]
                new(137876, DungeonDifficultiesNormalHeroicMythic), // Pattern: Warhide Bindings [Rank 3]
                new(137853, DungeonDifficultiesHeroicMythic), // Design: Sylvan Maelstrom Amulet [Rank 3]
            ]
        },
        // Eye of Azshara > Trash?
        // new(137726, DungeonDifficultiesAll), // Schematic: Leystone Buoy
        // new(141051, DungeonDifficultiesAll), // Technique: Glyph of the Trident
        // Eye of Azshara > Wrath of Azshara
        {
            1492,
            [ // normal+
                new(137825, DungeonDifficultiesNormalHeroicMythic), // Design: Dawnlight Band [Rank 2]
                new(141916,
                    DungeonDifficultiesNormalHeroicMythic), // Formula: Enchant Neck - Mark of the Ancient Priestess [Rank 2]
                new(127929, DungeonDifficultiesNormalHeroicMythic), // Recipe: Leytorrent Potion [Rank 2]
                new(137877, DungeonDifficultiesNormalHeroicMythic), // Pattern: Warhide Pants [Rank 3]
                new(136705, DungeonDifficultiesNormalHeroicMythic), // Technique: Aqual Mark
            ]
        },
        // Halls of Valor > trash?
        // new(137717, DungeonDifficultiesAll), // Schematic: Double-Barreled Cranial Cannon [Rank 3]
        // Halls of Valor > Odyn
        {
            1489,
            [
                new(137857, DungeonDifficultiesHeroicMythic), // Design: Raging Furystone Gorget (Rank 3)
                new(127933, DungeonDifficultiesHeroicMythic), // Recipe: Flask of Ten Thousand Scars [Rank 2]
                new(137911, DungeonDifficultiesMythic), // Pattern: Battlebound Grips [Rank 3]
                new(137607, DungeonDifficultiesMythic), // Plans: Leystone Helm [Rank 3]
            ]
        },
        // Maw of Souls > Helya
        {
            1663,
            [
                new(137848, DungeonDifficultiesHeroicMythic), // Design: Blessed Dawnlight Medallion [Rank 3]
                new(127932, DungeonDifficultiesHeroicMythic), // Recipe: Flask of the Countless Armies [Rank 2]
                new(136696, DungeonDifficultiesHeroicMythic), // Plans: Terrorspike
                new(137899, DungeonDifficultiesMythic), // Pattern: Dreadleather Jerkin [Rank 3]
            ]
        },
        // Neltharion's Lair > Dargrul
        {
            1687,
            [
                new(137912, DungeonDifficultiesNormalHeroicMythic), // Pattern: Battlebound Treads [Rank 3] n
                new(137854, DungeonDifficultiesHeroicMythic), // Design: Intrepid Necklace of Prophecy [Rank 3] h
                new(137864, DungeonDifficultiesHeroicMythic), // Design: Shadowruby Band [Rank 2]
                new(127928, DungeonDifficultiesHeroicMythic), // Recipe: Unbending Potion [Rank 2]
            ]
        },
        // RtK vendor??
        // new(31395, DungeonDifficultiesAll), // Plans: Iceguard Helm
        // new(31393, DungeonDifficultiesAll), // Plans: Iceguard Breastplate
        // new(31394, DungeonDifficultiesAll), // Plans: Iceguard Leggings
        // Return to Karazhan > Shared Drops
        {
            2_000_860,
            [
                new(143615, DungeonDifficultiesHeroicMythic), // Technique: Glyph of Crackling Ox Lightning
                new(143616, DungeonDifficultiesHeroicMythic), // Technique: Glyph of the Trusted Steed
            ]
        },
        // Return to Karazhan > Moroes
        {
            1837,
            [
                new(142246, DungeonDifficultiesHeroicMythic), // Broken Pocket Watch
            ]
        },
        // Return to Karazhan > Nightbane
        {
            1_0860_0,
            [
                new(142552, [23]), // Smoldering Ember Wyrm
                // Cloth
                new(142297, [23]), // Robes of the Ancient Chronicle
                // Leather
                new(142203, [23]), // Harness of Smoldering Betrayal
                // Mail
                new(142301, [23]), // Hauberk of Warped Intuition
                // Plate
                new(142303, [23]), // Chestplate of Impenetrable Darkness
            ]
        },
        // Seat of the Triumvirate > Vixx the Collector
        {
            1_0945_0,
            [
                new(153004, [2, 23]), // Unstable Portal Emitter
                new(152982, [2, 23]), // Vixx's Chest of Tricks
            ]
        },
        // Seat of the Triumvirate > L'ura
        {
            1982,
            [
                new(153037, DungeonDifficultiesHeroicMythic), // Technique: Glyph of Dark Absolution
            ]
        },
        // The Arcway > The Rat King
        {
            1_0726_0,
            [
                new(141053, DungeonDifficultiesHeroicMythic), // echnique: Glyph of Polymorphic Proportions
            ]
        },
        // The Arcway > Advisor Vandros
        {
            1501,
            [
                new(137897, DungeonDifficultiesHeroicMythic), // Pattern: Dreadleather Gloves [Rank 3]
                new(127927, DungeonDifficultiesHeroicMythic), // Recipe: Potion of the Old War [Rank 2]
                new(137712, DungeonDifficultiesHeroicMythic), // Schematic: Tactical Headgun [Rank 3]
                new(137851, DungeonDifficultiesMythic), // Design: Tranquil Necklace of Prophecy [Rank 3]
            ]
        },
        // Vault of the Wardens > Cordana Felsong
        {
            1470,
            [
                new(137852, DungeonDifficultiesHeroicMythic), // Design: Vindictive Pandemonite Choker [Rank 3]
                new(127931, DungeonDifficultiesHeroicMythic), // Recipe: Flask of the Seventh Demon [Rank 2]
                new(137930, DungeonDifficultiesHeroicMythic), // Pattern: Gravenscale Treads [Rank 3]
                new(128607, DungeonDifficultiesMythic), // Formula: Enchant Cloak - Binding of Strength [Rank 3]
            ]
        },
        // The Emerald Nightmare > Nythendra
        {
            1703,
            [
                new(139636, RaidDifficultiesAll), // Vantus Rune 1
                new(137748, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Emerald Nightmare > Il'gynoth, Heart of Corruption
        {
            1738,
            [
                new(139637, RaidDifficultiesAll), // Vantus Rune 1
                new(137749, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Emerald Nightmare > Elerethe Renferal
        {
            1744,
            [
                new(128611, RaidDifficultiesAll), // Formula: Enchant Neck - Mark of the Distant Army 3
                new(139640, RaidDifficultiesAll), // Vantus Rune 1
                new(137752, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Emerald Nightmare > Ursoc
        {
            1667,
            [
                new(141917, RaidDifficultiesAll), // Formula: Enchant Neck - Mark of the Heavy Hide 3
                new(139635, RaidDifficultiesAll), // Vantus Rune 1
                new(137747, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Emerald Nightmare > Dragons of Nightmare
        {
            1704,
            [
                new(139638, RaidDifficultiesAll), // Vantus Rune 1
                new(137750, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Emerald Nightmare > Cenarius
        {
            1750,
            [
                new(127934, RaidDifficultiesAll), // Recipe: Spirit Cauldron 2
                new(139641, RaidDifficultiesAll), // Vantus Rune 1
                new(137753, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Emerald Nightmare > Xavius
        {
            1726,
            [
                new(128612, RaidDifficultiesAll), // Formula: Enchant Neck - Mark of the Hidden Satyr 3
                new(139639, RaidDifficultiesAll), // Vantus Rune 1
                new(137751, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Skorpyron
        {
            1706,
            [
                new(139642, RaidDifficultiesAll), // Vantus Rune 1
                new(137754, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Chronomatic Anomaly
        {
            1725,
            [
                new(139643, RaidDifficultiesAll), // Vantus Rune 1
                new(137755, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Trilliax
        {
            1731,
            [
                new(139644, RaidDifficultiesAll), // Vantus Rune 1
                new(137756, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Spellblade Aluriel
        {
            1751,
            [
                new(139645, RaidDifficultiesAll), // Vantus Rune 1
                new(137757, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Tichondrius
        {
            1762,
            [
                new(137687, RaidDifficultiesAll), // Plans: Fel Core Hound Harness
                new(139646, RaidDifficultiesAll), // Vantus Rune 1
                new(137758, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Krosus
        {
            1713,
            [
                new(139648, RaidDifficultiesAll), // Vantus Rune 1
                new(137760, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > High Botanist Tel'arn
        {
            1761,
            [
                new(143751, RaidDifficultiesAll), // Technique: Glyph of Twilight Bloom
                new(139647, RaidDifficultiesAll), // Vantus Rune 1
                new(137759, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Star Augur Etraeus
        {
            1732,
            [
                new(142078, RaidDifficultiesAll), // Pattern: Imbued Silkweave Bag
                new(139649, RaidDifficultiesAll), // Vantus Rune 1
                new(137761, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Grand Magistrix Elisande
        {
            1743,
            [
                new(139650, RaidDifficultiesAll), // Vantus Rune 1
                new(137762, RaidDifficultiesAll), // Vantus Rune 2
            ]
        },
        // The Nighthold > Gul'dan
        {
            1737,
            [
                new(141061, RaidDifficultiesAll), // Technique: Grimoire of the Abyssal
                new(139651, RaidDifficultiesAll), // Vantus Rune 1
                new(137763, RaidDifficultiesAll), // Vantus Rune 2
                new(119211, RaidDifficultiesAll), // Golden Hearthstone Card: Lord Jaraxxus
                new(143544, RaidDifficultiesAll), // Skull of Corruption
            ]
        },
        // Trial of Valor > Odyn
        {
            1819,
            [
                new(142110, RaidDifficultiesAll), // Vantus Rune 1
                new(142104, RaidDifficultiesAll), // Vantus Rune 2
                new(143509, RaidDifficultiesAll), // Ensemble: Vestment of the Chosen Dead [L]
                new(143513, RaidDifficultiesAll), // Ensemble: Garb of the Chosen Dead [L]
                new(143517, RaidDifficultiesAll), // Ensemble: Chains of the Chosen Dead [L]
                new(143521, RaidDifficultiesAll), // Ensemble: Funerary Plate of the Chosen Dead [L]
            ]
        },
        // Trial of Valor > Guarm
        {
            1830,
            [
                new(142111, RaidDifficultiesAll), // Vantus Rune 1
                new(142105, RaidDifficultiesAll), // Vantus Rune 2
                new(143509, RaidDifficultiesAll), // Ensemble: Vestment of the Chosen Dead [L]
                new(143513, RaidDifficultiesAll), // Ensemble: Garb of the Chosen Dead [L]
                new(143517, RaidDifficultiesAll), // Ensemble: Chains of the Chosen Dead [L]
                new(143521, RaidDifficultiesAll), // Ensemble: Funerary Plate of the Chosen Dead [L]
            ]
        },
        // Trial of Valor > Helya
        {
            1829,
            [
                new(142112, RaidDifficultiesAll), // Vantus Rune 1
                new(142106, RaidDifficultiesAll), // Vantus Rune 2
                new(143509, RaidDifficultiesAll), // Ensemble: Vestment of the Chosen Dead [L]
                new(143513, RaidDifficultiesAll), // Ensemble: Garb of the Chosen Dead [L]
                new(143517, RaidDifficultiesAll), // Ensemble: Chains of the Chosen Dead [L]
                new(143521, RaidDifficultiesAll), // Ensemble: Funerary Plate of the Chosen Dead [L]
                new(143507, RaidDifficultiesHeroicMythic), // Ensemble: Vestment of the Chosen Dead [H]
                new(143511, RaidDifficultiesHeroicMythic), // Ensemble: Garb of the Chosen Dead [H]
                new(143515, RaidDifficultiesHeroicMythic), // Ensemble: Chains of the Chosen Dead [H]
                new(143519, RaidDifficultiesHeroicMythic), // Ensemble: Funerary Plate of the Chosen Dead [H]
            ]
        },
        // Tomb of Sargeras > Shared Drops
        {
            2000875,
            [
                new(146411, RaidDifficultiesAll), // Vantus Rune 1
                new(146412, RaidDifficultiesAll), // Vantus Rune 2
                new(146413, RaidDifficultiesAll), // Vantus Rune 3
            ]
        },
        // Tomb of Sargeras > Maiden of Vigilance
        {
            1897,
            [
                new(151524, RaidDifficultiesAll), // Hammer of Vigilance
            ]
        },
        // Tomb of Sargeras > Kil'jaeden
        {
            1898,
            [
                new(151539, RaidDifficultiesAll), // Technique: Glyph of Ember Shards
            ]
        },
        // Antorus > Shared Drops
        {
            2000946,
            [
                new(151654, RaidDifficultiesAll), // Vantus Rune 1
                new(151655, RaidDifficultiesAll), // Vantus Rune 2
                new(151656, RaidDifficultiesAll), // Vantus Rune 3
            ]
        },
        // Antorus > Aggramar
        {
            1984,
            [
                new(152094, RaidDifficultiesAll), // Taeshalach
            ]
        },
        // Antorus > Portal Keeper Hasabel
        {
            1985,
            [
                new(151748, RaidDifficultiesAll), // Pattern: Lightweave Breeches 3
            ]
        },
        // Antorus > Felhounds of Sargeras
        {
            1987,
            [
                new(151726, RaidDifficultiesAll), // Design: Empyrial Cosmic Crown 3
                new(151729, RaidDifficultiesAll), // Design: Empyrial Deep Crown 3
                new(151732, RaidDifficultiesAll), // Design: Empyrial Elemental Crown 3
                new(151735, RaidDifficultiesAll), // Design: Empyrial Titan Crown 3
            ]
        },
        // Antorus > Garothi Worldbreaker
        {
            1992,
            [
                new(151713, RaidDifficultiesAll), // Plans: Empyrial Breastplate 3
            ]
        },
        // Antorus > Antoran High Command
        {
            1997,
            [
                new(151742, RaidDifficultiesAll), // Pattern: Fiendish Shoulderguards 3
                new(151745, RaidDifficultiesAll), // Pattern: Fiendish Spaulders 3
            ]
        },
        // Antorus > Argus the Unmaker
        {
            2031,
            [
                new(153115, RaidDifficultiesAll), // Scythe of the Unmaker (blue)
                new(155880, [16]), // Scythe of the Unmaker (red) - Mythic
            ]
        },

        #endregion

        #region Legion Trash

        {
            1000768, // Emerald Nightmare > Trash
            [
                new(140993, RaidDifficultiesAll), // Gloves of Murmured Promises
                // Leather
                new(140996, RaidDifficultiesAll), // Grips of Silent Screams
                // Mail
                new(141694, RaidDifficultiesAll), // Gauntlets of Fractured Dreams
                // Plate
                new(141695, RaidDifficultiesAll), // Tarnished Dreamkeeper's Gauntlets
            ]
        },
        {
            1000861, // Trial of Valor
            [
                new(142541, RaidDifficultiesAll), // Drape of the Forgotten Souls
            ]
        },
        {
            1000786, // The Nighthold > Trash
            [
                new(144404, RaidDifficultiesAll), // Mana-Cord of Deception
                // Leather
                new(144405, RaidDifficultiesAll), // Waistclasp of Unethical Power
                // Mail
                new(144406, RaidDifficultiesAll), // Vintage Duskwatch Cinch
                // Plate
                new(144407, RaidDifficultiesAll), // Gleaming Celestial Waistguard
                // Cloak
                new(144399, RaidDifficultiesAll), // Aristocrat's Winter Drape
                new(144401, RaidDifficultiesAll), // Cloak of Multitudinous Sheaths
                new(144403, RaidDifficultiesAll), // Fashionable Autumn Cloak
                new(144400, RaidDifficultiesAll), // Feathermane Feather Cloak
            ]
        },
        {
            1000875, // Tomb of Sargeras > Trash
            [
                new(147422, RaidDifficultiesAll), // Acolyte's Abandoned Footwraps
                new(146989, RaidDifficultiesAll), // Fel-Flecked Grips
                new(147423, RaidDifficultiesAll), // Sash of the Unredeemed
                // Leather
                new(147425, RaidDifficultiesAll), // Cord of Pilfered Rosaries
                new(147424, RaidDifficultiesAll), // Treads of Violent Intrusion
                new(147038, RaidDifficultiesAll), // Wakening Horror Spaulders
                // Mail
                new(147427, RaidDifficultiesAll), // Pristine Moon-Wrought Clasp
                new(147044, RaidDifficultiesAll), // Soul-Rattle Ribcage
                new(147426, RaidDifficultiesAll), // Treads of Panicked Escape
                // Plate
                new(147064, RaidDifficultiesAll), // Diadem of the Highborne
                new(147429, RaidDifficultiesAll), // Girdle of the Crumbling Sanctum
                new(147428, RaidDifficultiesAll), // Spiked Terrorwake Greatboots
            ]
        },
        {
            1000946, // Antorus, the Burning Throne > Trash
            [
                new(153018, RaidDifficultiesAll), // Corrupted Mantle of the Felseekers
                new(152085, RaidDifficultiesAll), // Cuffs of the Viridian Flameweavers
                new(152084, RaidDifficultiesAll), // Gloves of Abhorrent Strategies
                // Leather
                new(152413, RaidDifficultiesAll), // Felflame Inferno Shoulderpads
                new(151993, RaidDifficultiesAll), // Leggings of the Sable Stalkers
                new(152087, RaidDifficultiesAll), // Sinuous Kerapteron Bindings
                // Mail
                new(152682, RaidDifficultiesAll), // Greaves of the Felblade Defenders
                new(152088, RaidDifficultiesAll), // Horror Fiend-Scale Breastplate
                new(152089, RaidDifficultiesAll), // Wristguards of Ominous Forging
                // Plate
                new(153019, RaidDifficultiesAll), // Hulking Demonlisher Legplates
                new(152090, RaidDifficultiesAll), // Impenetrable Garothi Breastplate
                new(152091, RaidDifficultiesAll), // Wristguards of the Dark Keepers
            ]
        },

        #endregion

        #region Battle for Azeroth

        // Mechagon > Trash Drops
        {
            1001178,
            [
                new(170212, DungeonDifficultiesHeroicMythic), // Recipe: Mecha-Bytes
                new(170211, DungeonDifficultiesHeroicMythic), // Recipe: Famine Evaluator and Snack Table [Rank 3]
                new(170210, DungeonDifficultiesHeroicMythic), // Recipe: Abyssal Healing Potion [Rank 3]
                new(170208, DungeonDifficultiesHeroicMythic), // Recipe: Potion of Unbridled Fury [Rank 3]
                new(170209, DungeonDifficultiesHeroicMythic), // Recipe: Potion of Wild Mending [Rank 3]
            ]
        },
        // Mechagon > King Mechagon
        {
            2331,
            [
                new(168830, [8]), // Aerial Unit R-21/X [mount]
            ]
        },
        // Uldir > Shared Drops
        {
            2001031,
            [
                new(162521, RaidDifficultiesAll), // Recipe: Mystical Cauldron 3
                new(162121, RaidDifficultiesAll), // Vantus Rune 1
                new(162124, RaidDifficultiesAll), // Vantus Rune 2
                new(162125, RaidDifficultiesAll), // Vantus Rune 3
            ]
        },
        // Uldir > Taloc
        {
            2168,
            [
                new(163119, RaidDifficultiesAll), // Khor, Hammer of the Guardian
            ]
        },
        // Battle for Dazar'alor > Shared Drops
        {
            2001176,
            [
                new(165693, RaidDifficultiesAll), // Vantus Rune 1
                new(165694, RaidDifficultiesAll), // Vantus Rune 2
                new(165695, RaidDifficultiesAll), // Vantus Rune 3
            ]
        },
        // Battle for Dazar'alor > High Tinker Mekkatorque
        {
            2334,
            [
                new(166276, RaidDifficultiesAll), // Schematic: Unstable Temporal Time Shifter
            ]
        },
        // Battle for Dazar'alor > King Rastakhan
        {
            2335,
            [
                new(165696, RaidDifficultiesAll), // Formula: Enchanted Tiki Mask
            ]
        },
        // Battle for Dazar'alor > Jaina Proudmoore
        {
            2343,
            [
                new(166582, RaidDifficultiesAll), // Technique: Glyph of the Tides
            ]
        },
        // Crucible of Storms > Shared Drops
        {
            2001177,
            [
                new(165735, RaidDifficultiesAll), // Vantus Rune 1
                new(165736, RaidDifficultiesAll), // Vantus Rune 2
                new(165737, RaidDifficultiesAll), // Vantus Rune 3
            ]
        },
        // The Eternal Palace > Shared Drops
        {
            2001179,
            [
                new(168625, RaidDifficultiesAll), // Vantus Rune 1
                new(168626, RaidDifficultiesAll), // Vantus Rune 2
                new(168627, RaidDifficultiesAll), // Vantus Rune 3
            ]
        },
        // The Eternal Palace > Za'qul
        {
            2349,
            [
                new(168868, RaidDifficultiesAll), // Pauldrons of Za'qul
            ]
        },
        // The Eternal Palace > Radiance of Azshara
        {
            2353,
            [
                new(170163, RaidDifficultiesAll), // Technique: Glyph of the Dark Depths
            ]
        },
        // Ny'alotha > Shared Drops
        {
            2001180,
            [
                new(171202, RaidDifficultiesAll), // Vantus Rune 1
                new(171201, RaidDifficultiesAll), // Vantus Rune 2
                new(171200, RaidDifficultiesAll), // Vantus Rune 3
            ]
        },
        // Ny'alotha > N'Zoth
        {
            2375,
            [
                new(207091, RaidDifficultiesAll), // Technique: Glyph of the Shath'Yar
            ]
        },
        // Azeroth > Doom's Howl
        {
            2213,
            [
                new(163828, RaidDifficultiesNormal), // Toy Siege Tower
            ]
        },
        // Azeroth > The Lion's Roar
        {
            2214,
            [
                new(163829, RaidDifficultiesNormal), // Toy War Machine
            ]
        },

        #endregion

        #region Battle for Azeroth Trash

        {
            1001031, // Uldir > Trash
            [
                new(161071, RaidDifficultiesAll), // Bloody Experimenter's Wraps
                new(160612, RaidDifficultiesAll), // Spellbound Specimen Handlers
                // Leather
                new(161075, RaidDifficultiesAll), // Antiseptic Specimen Handlers
                new(161072, RaidDifficultiesAll), // Splatterguards
                // Mail
                new(161076, RaidDifficultiesAll), // Iron-Grip Specimen Handlers
                new(161073, RaidDifficultiesAll), // Reinforced Test Subject Shackles
                // Plate
                new(161074, RaidDifficultiesAll), // Crushproof Vambraces
                new(161077, RaidDifficultiesAll), // Fluid-Resistant Specimen Handlers
            ]
        },
        {
            1001176, // Battle of Dazar'alor > Trash
            [
                new(165765, RaidDifficultiesAll), // Cord of Zandalari Resolve
                new(165509, RaidDifficultiesAll), // Slippers of the Encroaching Tide
                // Leather
                new(165520, RaidDifficultiesAll), // Silent Pillager's Footpads
                new(165518, RaidDifficultiesAll), // Warbeast Hide Cinch
                // Mail
                new(165547, RaidDifficultiesAll), // City Crusher Sabatons
                new(165545, RaidDifficultiesAll), // Waistguard of Elemental Resistance
                // Plate
                new(165563, RaidDifficultiesAll), // Boots of the Dark Iron Raider
                new(165564, RaidDifficultiesAll), // Last Stand Greatbelt
                // Cloak
                new(165925, RaidDifficultiesAll), // Drape of Valient Defense
            ]
        },
        {
            1001179, // The Eternal Palace > Trash
            [
                new(169929, RaidDifficultiesAll), // Cuffs of Soothing Currents
                new(169930, RaidDifficultiesAll), // Handwraps of Unhindered Resonance
                // Leather
                new(169932, RaidDifficultiesAll), // Brineweaver Guardian's Gloves
                new(169931, RaidDifficultiesAll), // Skulker's Blackwater Bands
                // Mail
                new(169933, RaidDifficultiesAll), // Abyssal Bubbler's Bracers
                new(169934, RaidDifficultiesAll), // Deepcrawler's Handguards
                // Plate
                new(169935, RaidDifficultiesAll), // Brutish Myrmidon's Vambraces
                new(169936, RaidDifficultiesAll), // Gauntlets of Crashing Tides
                // Cloak
                new(168602, RaidDifficultiesAll), // Cloak of Blessed Depths
            ]
        },
        {
            1001180, // Nya'lotha, the Waking City > Trash
            [
                new(175004, RaidDifficultiesAll), // Legwraps of Horrifying Figments
                // Leather
                new(175007, RaidDifficultiesAll), // Footpads of Terrible Delusions
                // Mail
                new(175005, RaidDifficultiesAll), // Belt of Concealed Intent
                // Plate
                new(175006, RaidDifficultiesAll), // Gauntlets of Nightmare Manifest
                // Weapon
                new(175010, RaidDifficultiesAll), // Maddened Adherent's Bulwark
                new(175009, RaidDifficultiesAll), // Zealous Ritualist's Reverie
            ]
        },

        #endregion

        #region Shadowlands Trash

        // Castle Nathria > Trash
        {
            1001190,
            [
                new(183017, RaidDifficultiesAll), // Acolyte's Velvet Bindings
                new(183008, RaidDifficultiesAll), // Supple Supplicant's Gloves
                // Leather
                new(182978, RaidDifficultiesAll), // Barkweave Wristwraps
                new(183010, RaidDifficultiesAll), // Stud-Scarred Footwear
                // Mail
                new(182990, RaidDifficultiesAll), // Legionnaire's Bloodstained Sabatons
                new(182982, RaidDifficultiesAll), // Watchful Arbelist's Bracers
                // Plate
                new(183013, RaidDifficultiesAll), // Fallen Templar's Gauntlets
                new(183031, RaidDifficultiesAll), // Soldier's Stoneband Wristguards
                // Cloak
                new(184778, RaidDifficultiesAll), // Decadent Nathrian Shawl
            ]
        },
        // Castle Nathria > Shared Drops
        {
            2001190,
            [
                new(173068, RaidDifficultiesAll), // Vantus Rune
            ]
        },
        // Sanctum of Domination > Trash
        {
            1001193,
            [
                new(186356, RaidDifficultiesAll), // Forlorn Prisoner's Strap
                new(186358, RaidDifficultiesAll), // Soulcaster's Woven Grips
                // Leather
                new(186362, RaidDifficultiesAll), // Bindings of the Subjugated
                new(186359, RaidDifficultiesAll), // Scoundrel's Harrowed Leggings
                // Mail
                new(186367, RaidDifficultiesAll), // Bonded Soulsmelt Greaves
                new(196364, RaidDifficultiesAll), // Cord of Coerced Spirits
                // Plate
                new(186371, RaidDifficultiesAll), // Ancient Brokensoul Bands
                new(186373, RaidDifficultiesAll), // Towering Shadowghast Greatboots
            ]
        },
        // Sanctum of Domination > Shared Drops
        {
            2001193,
            [
                new(186671, RaidDifficultiesAll), // Vantus Rune
            ]
        },
        // Sepulcher of the First Ones > Trash
        {
            1001195,
            [
                new(190630, RaidDifficultiesAll), // Devouring Pellicle Shoulderpads
                new(190631, RaidDifficultiesAll), // Vandalized Ephemera Mitts
                // Leather
                new(190626, RaidDifficultiesAll), // Hood of Empty Eternities
                new(190627, RaidDifficultiesAll), // Subversive Lord's Leggings
                // Mail
                new(190629, RaidDifficultiesAll), // Cartel's Larcenous Toecaps
                new(190628, RaidDifficultiesAll), // Lupine's Synthetic Headgear
                // Plate
                new(190624, RaidDifficultiesAll), // Gauntlets of the End
                new(190625, RaidDifficultiesAll), // Pauldrons of Possible Afterlives
            ]
        },
        // Sepulcher of the First Ones > Shared Drops
        {
            2001195,
            [
                new(187806, RaidDifficultiesAll), // Vantus Rune
            ]
        },
        // Sepulcher > Lihuvim
        {
            2461,
            [
                // TODO this starts a quest instead of being a recipe, wtf Blizzard
                new(189437, RaidDifficultiesAll), // Schematic: Stabilized Geomental
            ]
        },

        #endregion

        #region Dragonflight

        // Vault of the Incarnates > Trash
        {
            1001200,
            [
                new(202004, RaidDifficultiesAll), // Brawler's Earthen Cuirass
                new(201992, RaidDifficultiesAll), // Emissary's Flamewrought Seal
                new(202005, RaidDifficultiesAll), // Frozen Claw Mantle
                new(202008, RaidDifficultiesAll), // Galvanic Gaiters
                new(202006, RaidDifficultiesAll), // Greathelm of Horned Fury
                new(202009, RaidDifficultiesAll), // Lavamancer's Ceremonial Waistguard
                new(202003, RaidDifficultiesAll), // Primal Seeker's Leggings
                new(202010, RaidDifficultiesAll), // Primalist Warden's Bracers
                new(202007, RaidDifficultiesAll), // Woven Stone Bracelets
            ]
        },
        // Vault of the Incarnates > Shared Drops
        {
            2001200,
            [
                new(198956, RaidDifficultiesAll), // Vantus Rune
            ]
        },
        // Aberrus, the Shadowed Crucible > Trash
        {
            1001208,
            [
                new(204410, RaidDifficultiesAll), // Bands of Purified Purpose
                new(204411, RaidDifficultiesAll), // Crucible Curator's Wingspan
                new(204429, RaidDifficultiesAll), // Devoted Warden's Gaze
                new(204423, RaidDifficultiesAll), // Faulds of Failed Experiments
                new(204414, RaidDifficultiesAll), // Laboratory Assistant's Abductors
                new(204415, RaidDifficultiesAll), // Mantle of Sunless Kindling
                new(204430, RaidDifficultiesAll), // Sanctum Guard's Forgewalkers
                new(204422, RaidDifficultiesAll), // Sundered Edgelord's Breastplate
            ]
        },
        // Aberrus, the Shadowed Crucible > Shared Drops
        {
            2001208,
            [
                new(205134, RaidDifficultiesAll), // Vantus Rune
            ]
        },
        // Aberrus, the Shadowed Crucible > Assault of the Zaqali
        {
            2524,
            [
                new(194642, RaidDifficultiesAll), // Design: Choker of Shielding
                new(201740, RaidDifficultiesAll), // Elemental Codex of Ultimate Power
                new(194259, RaidDifficultiesAll), // Pattern: Allied Cinch of Time Dilation
                new(194266, RaidDifficultiesAll), // Pattern: Bronzed Grip Wrappings
                new(194260, RaidDifficultiesAll), // Pattern: Blue Dragon Soles
                new(193873, RaidDifficultiesAll), // Pattern: Old Spirit's Wristwraps
                new(193881, RaidDifficultiesAll), // Pattern: Scale Rein Grips
                new(193872, RaidDifficultiesAll), // Pattern: String of Spiritual Knick-Knacks
                new(193880, RaidDifficultiesAll), // Pattern: Wind Spirit's Lasso
                new(194489, RaidDifficultiesAll), // Plans: Allied Chestplate of Generosity
                new(194490, RaidDifficultiesAll), // Plans: Allied Wristguard of Companionship
                new(191597, RaidDifficultiesAll), // Recipe: Potion Absorption Inhibitor
                new(199227, RaidDifficultiesAll), // Schematic: Sophisticated Problem Solver
            ]
        },
        // Amirdrassil, the Dream's Hope > Trash
        {
            1001207,
            [
                new(208442, RaidDifficultiesAll), // Daydreamer's Glimmering Ring
                new(208427, RaidDifficultiesAll), // Insurgent Flame Warboots
                new(208431, RaidDifficultiesAll), // Lost Scholar's Temporal Shoulderdials
                new(208428, RaidDifficultiesAll), // Mantle of Slumbering Sands
                new(208426, RaidDifficultiesAll), // Mask of the Unbidden Grim
                new(208434, RaidDifficultiesAll), // Sentinel's Gilded Poulaines
                new(208432, RaidDifficultiesAll), // Vengeful Bladebeak Girdle
                new(208420, RaidDifficultiesAll), // Visage of the Devouring Flame
                new(208430, RaidDifficultiesAll), // Whispering Fanged Cord
            ]
        },
        // Amirdrassil, the Dream's Hope > Shared Drops
        {
            2001207,
            [
                new(210490, RaidDifficultiesAll), // Vantus Rune
            ]
        },

        #endregion

        #region The War Within

        // Nerub-ar Palace > Trash
        {
            1001273,
            [
                new(225728, RaidDifficultiesAll), // Acidic Attendant's Loop
                new(225722, RaidDifficultiesAll), // Adorned Lynxborne Pauldrons
                new(225727, RaidDifficultiesAll), // Captured Earthen's Ironhorns
                new(225744, RaidDifficultiesAll), // Heritage Militia's Stompers
                new(225725, RaidDifficultiesAll), // Lurking Marauder's Binding
                new(225721, RaidDifficultiesAll), // Prime Slime Slippers
                new(225724, RaidDifficultiesAll), // Shrillwing Hunter's Prey
                new(225723, RaidDifficultiesAll), // Venom Stalker's Strap
                new(225720, RaidDifficultiesAll), // Web Acolyte's Hood
            ]
        },
        // Liberation of Undermine > Trash
        {
            1001296,
            [
                new(232661, RaidDifficultiesAll), // Bootleg Wrynn Shoulderplates
                new(232658, RaidDifficultiesAll), // Firebug's Anklegear
                new(232662, RaidDifficultiesAll), // Globlin-Fused Greatbelt
                new(232659, RaidDifficultiesAll), // Loyalist's Holdout Hood
                new(232657, RaidDifficultiesAll), // Mechgineer's Blowtorch Cover
                new(232660, RaidDifficultiesAll), // Midnight Lounge Cummerbund
                new(232656, RaidDifficultiesAll), // Psychopath's Ravemantle
                new(232663, RaidDifficultiesAll), // Undermine Merc's Dog Tags
                new(232655, RaidDifficultiesAll), // Vatwork Janitor's Wasteband
            ]
        },

        #endregion
    };
}

public class ExtraItemDrop
{
    public int ItemId { get; set; }
    public List<int> Difficulties { get; set; }

    public ExtraItemDrop(int itemId, IEnumerable<int> difficulties)
    {
        ItemId = itemId;
        Difficulties = difficulties.ToList();
    }
}
