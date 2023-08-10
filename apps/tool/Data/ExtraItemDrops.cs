namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    private static readonly int[] DungeonDifficultiesNormal = { 1 };
    private static readonly int[] DungeonDifficultiesHeroic = { 2 };
    private static readonly int[] RaidDifficultiesLegacy10Normal = { 3 };
    private static readonly int[] RaidDifficultiesLegacy25Normal = { 4 };
    private static readonly int[] RaidDifficultiesLegacy10Heroic = { 5 };
    private static readonly int[] RaidDifficultiesLegacy25Heroic = { 6 };
    private static readonly int[] RaidDifficultiesLegacy40 = { 9 };
    private static readonly int[] RaidDifficultiesNormal = { 14 };

    private static readonly int[] RaidDifficultiesAll = { 17, 14, 15, 16 };
    private static readonly int[] RaidDifficultiesLfrNormalHeroic = { 3, 4, 5, 6, 7 };
    private static readonly int[] RaidDifficultiesNoLfr = { 14, 15, 16 };

    private static readonly List<ExtraItemDrop> FrozenHallsTrashDrops = new List<ExtraItemDrop>
    {
        // Cloth
        new (49854, DungeonDifficultiesNormal), // Mantle of Tattered Feathers [N]
        // Leather
        new (50318, DungeonDifficultiesHeroic), // Ghostly Wristwraps [H]
        // Plate
        new (49855, DungeonDifficultiesNormal), // Plated Grips of Korth'azz [N]
        new (49853, DungeonDifficultiesNormal), // Titanium Links of Lore [N]
        // Weapon
        new (49852, DungeonDifficultiesNormal), // Coffin Nail [N]
        new (50315, DungeonDifficultiesHeroic), // Seven-Fingered Claws [H]
        new (50319, DungeonDifficultiesHeroic), // Unsharpened Ice Razor [H]
        // Battered Hilt
        new (50046, DungeonDifficultiesHeroic), // Quel'Delar, Cunning of the Shadows
        new (50047, DungeonDifficultiesHeroic), // Quel'Delar, Lens of the Mind
        new (50048, DungeonDifficultiesHeroic), // Quel'Delar, Might of the Faithful
        new (50049, DungeonDifficultiesHeroic), // Quel'Delar, Ferocity of the Scorned
        new (50050, DungeonDifficultiesHeroic), // Cudgel of Furious Justice
        new (50051, DungeonDifficultiesHeroic), // Hammer of Purified Flame
        new (50052, DungeonDifficultiesHeroic), // Lightborn Spire
    };

    public static readonly Dictionary<int, List<ExtraItemDrop>> ExtraItemDrops = new()
    {
        {
            895, // Razorfen Kraul > Roogug
            new List<ExtraItemDrop>
            {
                new(151443, DungeonDifficultiesNormal), // Roogug's Swinesteel Girdle - Normal
            }
        },

        #region Miscellaneous
        // Darkmaul Citadel
        {
            100010, // Tunk
            new List<ExtraItemDrop>
            {
                new (178162, DungeonDifficultiesNormal), // Tunk's Whomper
                new (178163, DungeonDifficultiesNormal), // Tunk's Shinguard
                new (178164, DungeonDifficultiesNormal), // Tunk's Needle
                new (178165, DungeonDifficultiesNormal), // Tunk's Tooth
                new (178166, DungeonDifficultiesNormal), // Tunk's Toothpick
                new (178167, DungeonDifficultiesNormal), // Tunk's Lil' Whomper
                new (179360, DungeonDifficultiesNormal), // Tunk's Tiny Bow
                //new (179362, DungeonDifficultiesNormal), // Tunk's Backscratcher -- doesn't actually exist
            }
        },
        {
            100011, // Gor'groth
            new List<ExtraItemDrop>
            {
                new (178169, DungeonDifficultiesNormal), // Decrepit Dragonscale Drape
            }
        },
        // Anniversary World Bosses
        {
            100020, // Azuregos
            new List<ExtraItemDrop>
            {
                // Cloth
                new (150419, DungeonDifficultiesNormal), // Crystal Adorned Crown
                new (150425, DungeonDifficultiesNormal), // Snowblind Shoes
                // Leather
                new (150543, DungeonDifficultiesNormal), // Sapphire-Encrusted Tunic
                // Mail
                new (150544, DungeonDifficultiesNormal), // Mana-Frosted Pauldrons
                // Plate
                new (150422, DungeonDifficultiesNormal), // Unmelting Ice Girdle
                // Cloak
                new (150417, DungeonDifficultiesNormal), // Drape of Benediction
                // Weapon
                new (150424, DungeonDifficultiesNormal), // Cold Snap
                new (150428, DungeonDifficultiesNormal), // Eskhandar's Left Claw
                new (150423, DungeonDifficultiesNormal), // Fang of the Mystics
                new (150421, DungeonDifficultiesNormal), // Typhoon
            }
        },
        {
            100021, // Lord Kazzak
            new List<ExtraItemDrop>
            {
                // Cloth
                new (150386, DungeonDifficultiesNormal), // Blacklight Bracer
                new (150385, DungeonDifficultiesNormal), // Fel Infused Leggings
                // Leather
                new (150382, DungeonDifficultiesNormal), // Doomhide Gauntlets
                new (150381, DungeonDifficultiesNormal), // Flayed Doomguard Belt
                // Mail
                new (150379, DungeonDifficultiesNormal), // Infernal Headcage
                // Cloak
                new (150380, DungeonDifficultiesNormal), // Eskhandar's Pelt
                // Weapon
                new (150383, DungeonDifficultiesNormal), // Amberseal Keeper
                new (150427, DungeonDifficultiesNormal), // Empyrean Demolisher
            }
        },
        {
            100022, // Dragons of Nightmare
            new List<ExtraItemDrop>
            {
                // Cloak
                new (150411, DungeonDifficultiesNormal), // Green Dragonskin Cloak
                // Weapon
                new (150429, DungeonDifficultiesNormal), // Emerald Dragonfang
                new (150412, DungeonDifficultiesNormal), // Hammer of Bestial Fury
                new (150393, DungeonDifficultiesNormal), // Nightmare Blade
                new (150403, DungeonDifficultiesNormal), // Polished Ironwood Crossbow
                new (150408, DungeonDifficultiesNormal), // Staff of Rampant Growth
            }
        },
        {
            100023, // Emeriss
            new List<ExtraItemDrop>
            {
                // Cloth
                new (150416, DungeonDifficultiesNormal), // Gloves of Delusional Power
                // Leather
                new (150405, DungeonDifficultiesNormal), // Circlet of Restless Dreams
                new (150415, DungeonDifficultiesNormal), // Dragonspur Wraps
                // Mail
                new (150406, DungeonDifficultiesNormal), // Boots of the Endless Moor
                // Plate
                new (150410, DungeonDifficultiesNormal), // Acid Inscribed Greaves
            }
        },
        {
            100024, // Lethon
            new List<ExtraItemDrop>
            {
                // Cloth
                new (150399, DungeonDifficultiesNormal), // Black Bark Wristbands
                // Leather
                new (150398, DungeonDifficultiesNormal), // Dark Heart Pants
                new (150401, DungeonDifficultiesNormal), // Deviate Growth Cap
                // Mail
                new (150400, DungeonDifficultiesNormal), // Malignant Footguards
                // Plate
                new (150402, DungeonDifficultiesNormal), // Gauntlets of the Shining Light
            }
        },
        {
            100025, // Taerar
            new List<ExtraItemDrop>
            {
                // Cloth
                new (150394, DungeonDifficultiesNormal), // Mendicant's Slippers
                // Leather
                new (150395, DungeonDifficultiesNormal), // Unnatural Leather Spaulders
                // Mail
                new (150414, DungeonDifficultiesNormal), // Ancient Corroded Leggings
                // Plate
                new (150413, DungeonDifficultiesNormal), // Dragonbone Wristguards
                new (150390, DungeonDifficultiesNormal), // Strangely Glyphed Legplates
            }
        },
        {
            100026, // Ysondre
            new List<ExtraItemDrop>
            {
                // Cloth
                new (150397, DungeonDifficultiesNormal), // Belt of the Dark Bog
                new (150391, DungeonDifficultiesNormal), // Jade Inlaid Vestments
                // Leather
                new (150396, DungeonDifficultiesNormal), // Boots of Fright
                // Mail
                new (150389, DungeonDifficultiesNormal), // Leggings of the Demented Mind
                // Plate
                new (150387, DungeonDifficultiesNormal), // Acid Inscribed Pauldrons
                // Weapon
                new (150409, DungeonDifficultiesNormal), // Trance Stone
            }
        },
        {
            100027, // Doomwalker
            new List<ExtraItemDrop>
            {
                // Mount
                new (186469, DungeonDifficultiesNormal), // Illidari Doomhawk
                // Toy
                new (186501, DungeonDifficultiesNormal), // Doomwalker Trophy Stand
                // Cloth
                new (186460, DungeonDifficultiesNormal), // Anger-Spark Gloves
                new (186461, DungeonDifficultiesNormal), // Gilded Trousers of Benediction
                // Leather
                new (186475, DungeonDifficultiesNormal), // Hellstitched Mantle
                new (186463, DungeonDifficultiesNormal), // Terrorweave Tunic
                // Mail
                new (186481, DungeonDifficultiesNormal), // Darkcrest Waistguard
                new (186464, DungeonDifficultiesNormal), // Fathom-Helm of the Deeps
                // Plate
                new (186465, DungeonDifficultiesNormal), // Faceguard of the Endless Watch
                new (186484, DungeonDifficultiesNormal), // Voidforged Greaves
                // Cloak
                new (186462, DungeonDifficultiesNormal), // Black-Iron Battlecloak
                // Weapon
                new (186506, DungeonDifficultiesNormal), // Akama's Edge
                new (186467, DungeonDifficultiesNormal), // Barrel-Blade Longrifle
                new (186466, DungeonDifficultiesNormal), // Ethereum Nexus-Reaver
                new (186468, DungeonDifficultiesNormal), // Talon of the Tempest
            }
        },
        {
            100030, // Treasure Goblin
            new List<ExtraItemDrop>
            {
                // Mount
                new (76755, DungeonDifficultiesNormal), // Tyrael's Charger
                // Pet
                new (3580, DungeonDifficultiesNormal), // Baa'lial
                // Toy
                new (206008, DungeonDifficultiesNormal), // Nightmare Banner
                new (142542, DungeonDifficultiesNormal), // Tome of Town Portal
                new (143543, DungeonDifficultiesNormal), // Twelve-String Guitar
                // Cosmetic
                new (206020, DungeonDifficultiesNormal), // Enmity Hood
                new (206004, DungeonDifficultiesNormal), // Enmity Cloak
                new (206007, DungeonDifficultiesNormal), // Treasure Nabbin' Bag
                // Weapon
                new (206275, DungeonDifficultiesNormal), // Wirt's Fighting Leg
                new (206276, DungeonDifficultiesNormal), // Wirt's Haunted Leg
                new (206005, DungeonDifficultiesNormal), // Wirt's Last Leg
                new (143327, DungeonDifficultiesNormal), // Livestock Lochaber Axe
            }
        },
        #endregion

        #region Classic
        // Dire Maul > Gordok Tribute
        {
            102300,
            new List<ExtraItemDrop>
            {
                // Cloth
                new (18532, DungeonDifficultiesNormal), // Mindsurge Robe
                new (18475, DungeonDifficultiesNormal), // Oddly Magical Belt
                // Leather
                new (18528, DungeonDifficultiesNormal), // Cyclone Spaulders
                new (18478, DungeonDifficultiesNormal), // Hyena Hide Jerkin
                new (18476, DungeonDifficultiesNormal), // Mud Stained Boots
                new (18477, DungeonDifficultiesNormal), // Shaggy Leggings
                // Mail
                new (18479, DungeonDifficultiesNormal), // Carrion Scorpid Helm
                new (18530, DungeonDifficultiesNormal), // Ogre Forged Hauberk
                // Plate
                new (18529, DungeonDifficultiesNormal), // Elemental Plate Girdle
                new (18533, DungeonDifficultiesNormal), // Gordok Bracers of Power
                new (18480, DungeonDifficultiesNormal), // Scarab Plate Helm
                // Cloak
                new (18495, DungeonDifficultiesNormal), // Redoubt Cloak
                // Weapon
                new (18538, DungeonDifficultiesNormal), // Treant's Bane
                new (18481, DungeonDifficultiesNormal), // Skullcracking Mace
                new (18531, DungeonDifficultiesNormal), // Unyielding Maul
                new (18534, DungeonDifficultiesNormal), // Rod of the Ogre Magi
                new (18482, DungeonDifficultiesNormal), // Ogre Toothpick Shooter
                new (18499, DungeonDifficultiesNormal), // Barrier Shield
            }
        },
        // Gnomeregan > Endgineer Omegaplugg
        {
            102310,
            new List<ExtraItemDrop>
            {
                // Toy
                new (141331, DungeonDifficultiesNormal), // Vial of Green Goo
            }
        },
        // Stratholme > Postmaster Malown
        {
            102360,
            new List<ExtraItemDrop>
            {
                // Cloth
                new (13390, DungeonDifficultiesNormal), // The Postmaster's Band
                new (13391, DungeonDifficultiesNormal), // The Postmaster's Treads
                new (13389, DungeonDifficultiesNormal), // The Postmaster's Trousers
                new (13388, DungeonDifficultiesNormal), // The Postmaster's Tunic
                // Weapon
                new (13393, DungeonDifficultiesNormal), // Malown's Slam
            }
        },
        // Stratholme > Skul
        {
            102361,
            new List<ExtraItemDrop>
            {
                // Leather
                new (13395, DungeonDifficultiesNormal), // Skul's Fingerbone Claws
                // Plate
                new (13394, DungeonDifficultiesNormal), // Skul's Cold Embrace
                // Weapon
                new (13396, DungeonDifficultiesNormal), // Skul's Ghastly Touch
            }
        },
        // Stratholme > Stonespine
        {
            102362,
            new List<ExtraItemDrop>
            {
                // Cloth
                new (13954, DungeonDifficultiesNormal), // Verdant Footpads
                // Cloak
                new (13397, DungeonDifficultiesNormal), // Stoneskin Gargoyle Cape
                // Weapon
                new (13399, DungeonDifficultiesNormal), // Gargoyle Shredder Talons
            }
        },
        #endregion

        #region Classic Trash
        {
            1000741, // Molten Core > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (16802, RaidDifficultiesLegacy40), // Arcanist Belt
                new (16799, RaidDifficultiesLegacy40), // Arcanist Bindings
                new (16817, RaidDifficultiesLegacy40), // Girdle of Prophecy
                new (16806, RaidDifficultiesLegacy40), // Felheart Belt
                new (16804, RaidDifficultiesLegacy40), // Felheart Bracers
                new (16819, RaidDifficultiesLegacy40), // Vambraces of Prophecy
                // Leather
                new (16828, RaidDifficultiesLegacy40), // Cenarion Belt
                new (16830, RaidDifficultiesLegacy40), // Cenarion Bracers
                new (16827, RaidDifficultiesLegacy40), // Nightslayer Belt
                new (16825, RaidDifficultiesLegacy40), // Nightslayer Bracelets
                // Mail
                new (16838, RaidDifficultiesLegacy40), // Earthfury Belt
                new (16840, RaidDifficultiesLegacy40), // Earthfury Bracers
                new (16851, RaidDifficultiesLegacy40), // Giantstalker's Belt
                new (16850, RaidDifficultiesLegacy40), // Giantstalker's Bracers
                // Plate
                new (16864, RaidDifficultiesLegacy40), // Belt of Might
                new (16861, RaidDifficultiesLegacy40), // Bracers of Might
                new (16858, RaidDifficultiesLegacy40), // Lawbringer Belt
                new (16857, RaidDifficultiesLegacy40), // Lawbringer Bracers
            }
        },
        {
            1000742, // Blackwing Lair > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (19437, RaidDifficultiesLegacy40), // Boots of Pure Thought
                new (19438, RaidDifficultiesLegacy40), // Ringo's Blizzard Boots
                // Leather
                new (19439, RaidDifficultiesLegacy40), // Interlaced Shadow Jerkin
                // Cloak
                new (19436, RaidDifficultiesLegacy40), // Cloak of Draconic Might
                // Weapon
                new (19362, RaidDifficultiesLegacy40), // Doom's Edge
                new (19354, RaidDifficultiesLegacy40), // Draconic Avenger
                new (19358, RaidDifficultiesLegacy40), // Draconic Maul
                new (19435, RaidDifficultiesLegacy40), // Essence Gatherer
            }
        },
        {
            1000743, // Ruins of Ahn'Qiraj > Trash
            new List<ExtraItemDrop>
            {
                // Mail
                new (21804, RaidDifficultiesLegacy10Normal), // Coif of Elemental Fury
                // Plate
                new (21803, RaidDifficultiesLegacy10Normal), // Helm of the Holy Avenger
                new (21805, RaidDifficultiesLegacy10Normal), // Polished Obsidian Pauldrons
                // Weapon
                new (21801, RaidDifficultiesLegacy10Normal), // Antenna of Invigoration
                new (21800, RaidDifficultiesLegacy10Normal), // Silithid Husked Launcher
                new (21802, RaidDifficultiesLegacy10Normal), // The Lost Kris of Zedd
            }
        },
        {
            1000744, // Temple of Ahn'Qiraj > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (21838, RaidDifficultiesLegacy40), // Garb of Royal Ascension
                new (21888, RaidDifficultiesLegacy40), // Gloves of the Immortal
                // Plate
                new (21889, RaidDifficultiesLegacy40), // Gloves of the Redeemed Prophecy
                // Weapon
                new (21837, RaidDifficultiesLegacy40), // Anubisath Warhammer
                new (21856, RaidDifficultiesLegacy40), // Neretzek, The Blood Drinker

                new (21890, RaidDifficultiesLegacy40), // Gloves of the Fallen Prophet
            }
        },
        #endregion

        #region The Burning Crusade
        // Old Hillsbrad Foothills / Don Carlos
        {
            102510,
            new List<ExtraItemDrop>
            {
                // Toy
                new (134019, DungeonDifficultiesHeroic), // Don Carlos' Famous Hat
            }
        },
        // Karazhan / Nightbane
        {
            107450,
            new List<ExtraItemDrop>
            {
                // Cloth
                new (28602, RaidDifficultiesLegacy10Normal), // Robe of the Elder Scribes
                // Leather
                new (28601, RaidDifficultiesLegacy10Normal), // Chestguard of the Conniver
                new (28600, RaidDifficultiesLegacy10Normal), // Stonebough Jerkin
                // Mail
                new (28610, RaidDifficultiesLegacy10Normal), // Ferocious Swift-Kickers
                new (28599, RaidDifficultiesLegacy10Normal), // Scaled Breastplate of Carnage
                // Plate
                new (28608, RaidDifficultiesLegacy10Normal), // Ironstriders of Urgency
                new (28597, RaidDifficultiesLegacy10Normal), // Panzar'Thar Breastplate
                // Weapon
                new (28604, RaidDifficultiesLegacy10Normal), // Nightstaff of the Everliving
                new (28603, RaidDifficultiesLegacy10Normal), // Talisman of Nightbane
                new (28611, RaidDifficultiesLegacy10Normal), // Dragonheart Flameshield
                new (28606, RaidDifficultiesLegacy10Normal), // Shield of Impenetrable Darkness
            }
        },
        #endregion

        #region The Burning Crusade Trash
        {
            1000745, // Karazhan > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (30668, RaidDifficultiesLegacy10Normal), // Grasp of the Dead
                new (30673, RaidDifficultiesLegacy10Normal), // Inferno Waist Cord
                // Leather
                new (30644, RaidDifficultiesLegacy10Normal), // Grips of Deftness
                new (30674, RaidDifficultiesLegacy10Normal), // Zierhut's Lost Treads
                // Mail
                new (30643, RaidDifficultiesLegacy10Normal), // Belt of the Tracker
                // Plate
                new (30641, RaidDifficultiesLegacy10Normal), // Boots of Elusion
                // Cloak
                new (30642, RaidDifficultiesLegacy10Normal), // Drape of the Righteous
            }
        },
        {
            1000748, // Serpentshrine Cavern > Trash
            new List<ExtraItemDrop>
            {
                // Plate
                new (30027, RaidDifficultiesLegacy25Normal), // Boots of Courage Unending
                // Weapon
                new (30021, RaidDifficultiesLegacy25Normal), // Wildfury Greatstaff
            }
        },
        {
            1000749, // The Eye > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (30020, RaidDifficultiesLegacy25Normal), // Fire-Cord of the Magus
                new (30024, RaidDifficultiesLegacy25Normal), // Mantle of the Elven Kings
                // Leather
                new (30029, RaidDifficultiesLegacy25Normal), // Bark-Gloves of Ancient Wisdom
                // Mail
                new (30026, RaidDifficultiesLegacy25Normal), // Bands of the Celestial Archer
                new (30030, RaidDifficultiesLegacy25Normal), // Girdle of Fallen Stars
            }
        },
        {
            1000750, // The Battle for Mount Hyjal > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (32609, RaidDifficultiesLegacy25Normal), // Boots of the Divine Light
                // Mail
                new (32592, RaidDifficultiesLegacy25Normal), // Chestguard of Relentless Storms
                // Cloak
                new (32590, RaidDifficultiesLegacy25Normal), // Nethervoid Cloak
                new (34010, RaidDifficultiesLegacy25Normal), // Pepe's Shroud of Pacification
                // Weapon
                new (34009, RaidDifficultiesLegacy25Normal), // Hammer of Judgement
                new (32946, RaidDifficultiesLegacy25Normal), // Claw of Molten Fury
                new (32945, RaidDifficultiesLegacy25Normal), // Fist of Molten Fury
            }
        },
        {
            1000751, // Black Temple > Trash
            new List<ExtraItemDrop>
            {
                // Leather
                new (32593, RaidDifficultiesNormal), // Treads of the Den Mother
                // Plate
                new (32606, RaidDifficultiesNormal), // Girdle of the Lightbearer
                new (32608, RaidDifficultiesNormal), // Pillager's Gauntlets
                // Cloak
                new (34012, RaidDifficultiesNormal), // Shroud of the Final Stand
                // Weapon
                new (32943, RaidDifficultiesNormal), // Swiftsteel Bludgeon
                new (34011, RaidDifficultiesNormal), // Illidari Runeshield
            }
        },
        {
            1000752, // Sunwell Plateau > Trash
            new List<ExtraItemDrop>
            {
                // Leather
                new (34351, RaidDifficultiesLegacy25Normal), // Tranquil Majesty Wraps
                new (34407, RaidDifficultiesLegacy25Normal), // Tranquil Moonlight Wraps
                // Mail
                new (34350, RaidDifficultiesLegacy25Normal), // Gauntlets of the Ancient Shadowmoon
                new (34409, RaidDifficultiesLegacy25Normal), // Gauntlets of the Ancient Frostwolf
                // Weapon
                new (34346, RaidDifficultiesLegacy25Normal), // Mounting Vengeance
                new (34183, RaidDifficultiesLegacy25Normal), // Shivering Felspine
                new (34348, RaidDifficultiesLegacy25Normal), // Wand of Cleansing Light
                new (34347, RaidDifficultiesLegacy25Normal), // Wand of the Demonsoul
            }
        },
        #endregion

        #region Wrath of the Lich King
        // The Culling of Stratholme > Infinite Corruptor
        {
            102790,
            new List<ExtraItemDrop>
            {
                new(43951, DungeonDifficultiesHeroic), // Reins of the Bronze Drake
            }
        },
        // Icecrown Citadel > Sanctified T10
        {
            107580,
            new List<ExtraItemDrop>
            {
                // Conqueror's Mark of Sanctification [10H]
                new (51160, RaidDifficultiesLegacy10Heroic),
                new (51161, RaidDifficultiesLegacy10Heroic),
                new (51162, RaidDifficultiesLegacy10Heroic),
                new (51163, RaidDifficultiesLegacy10Heroic),
                new (51164, RaidDifficultiesLegacy10Heroic),
                new (51165, RaidDifficultiesLegacy10Heroic),
                new (51166, RaidDifficultiesLegacy10Heroic),
                new (51167, RaidDifficultiesLegacy10Heroic),
                new (51168, RaidDifficultiesLegacy10Heroic),
                new (51169, RaidDifficultiesLegacy10Heroic),
                new (51170, RaidDifficultiesLegacy10Heroic),
                new (51171, RaidDifficultiesLegacy10Heroic),
                new (51172, RaidDifficultiesLegacy10Heroic),
                new (51173, RaidDifficultiesLegacy10Heroic),
                new (51174, RaidDifficultiesLegacy10Heroic),
                new (51175, RaidDifficultiesLegacy10Heroic),
                new (51176, RaidDifficultiesLegacy10Heroic),
                new (51177, RaidDifficultiesLegacy10Heroic),
                new (51178, RaidDifficultiesLegacy10Heroic),
                new (51179, RaidDifficultiesLegacy10Heroic),
                new (51180, RaidDifficultiesLegacy10Heroic),
                new (51181, RaidDifficultiesLegacy10Heroic),
                new (51182, RaidDifficultiesLegacy10Heroic),
                new (51183, RaidDifficultiesLegacy10Heroic),
                new (51184, RaidDifficultiesLegacy10Heroic),
                new (51205, RaidDifficultiesLegacy10Heroic),
                new (51206, RaidDifficultiesLegacy10Heroic),
                new (51207, RaidDifficultiesLegacy10Heroic),
                new (51208, RaidDifficultiesLegacy10Heroic),
                new (51209, RaidDifficultiesLegacy10Heroic),

                // Conqueror's Mark of Sanctification [25H]
                new (51230, RaidDifficultiesLegacy25Heroic),
                new (51231, RaidDifficultiesLegacy25Heroic),
                new (51232, RaidDifficultiesLegacy25Heroic),
                new (51233, RaidDifficultiesLegacy25Heroic),
                new (51234, RaidDifficultiesLegacy25Heroic),
                new (51255, RaidDifficultiesLegacy25Heroic),
                new (51256, RaidDifficultiesLegacy25Heroic),
                new (51257, RaidDifficultiesLegacy25Heroic),
                new (51258, RaidDifficultiesLegacy25Heroic),
                new (51259, RaidDifficultiesLegacy25Heroic),
                new (51260, RaidDifficultiesLegacy25Heroic),
                new (51261, RaidDifficultiesLegacy25Heroic),
                new (51262, RaidDifficultiesLegacy25Heroic),
                new (51263, RaidDifficultiesLegacy25Heroic),
                new (51264, RaidDifficultiesLegacy25Heroic),
                new (51265, RaidDifficultiesLegacy25Heroic),
                new (51266, RaidDifficultiesLegacy25Heroic),
                new (51267, RaidDifficultiesLegacy25Heroic),
                new (51268, RaidDifficultiesLegacy25Heroic),
                new (51269, RaidDifficultiesLegacy25Heroic),
                new (51270, RaidDifficultiesLegacy25Heroic),
                new (51271, RaidDifficultiesLegacy25Heroic),
                new (51272, RaidDifficultiesLegacy25Heroic),
                new (51273, RaidDifficultiesLegacy25Heroic),
                new (51274, RaidDifficultiesLegacy25Heroic),
                new (51275, RaidDifficultiesLegacy25Heroic),
                new (51276, RaidDifficultiesLegacy25Heroic),
                new (51277, RaidDifficultiesLegacy25Heroic),
                new (51278, RaidDifficultiesLegacy25Heroic),
                new (51279, RaidDifficultiesLegacy25Heroic),

                // Protector's Mark of Sanctification [10H]
                new (51150, RaidDifficultiesLegacy10Heroic),
                new (51151, RaidDifficultiesLegacy10Heroic),
                new (51152, RaidDifficultiesLegacy10Heroic),
                new (51153, RaidDifficultiesLegacy10Heroic),
                new (51154, RaidDifficultiesLegacy10Heroic),
                new (51190, RaidDifficultiesLegacy10Heroic),
                new (51191, RaidDifficultiesLegacy10Heroic),
                new (51192, RaidDifficultiesLegacy10Heroic),
                new (51193, RaidDifficultiesLegacy10Heroic),
                new (51194, RaidDifficultiesLegacy10Heroic),
                new (51195, RaidDifficultiesLegacy10Heroic),
                new (51196, RaidDifficultiesLegacy10Heroic),
                new (51197, RaidDifficultiesLegacy10Heroic),
                new (51198, RaidDifficultiesLegacy10Heroic),
                new (51199, RaidDifficultiesLegacy10Heroic),
                new (51200, RaidDifficultiesLegacy10Heroic),
                new (51201, RaidDifficultiesLegacy10Heroic),
                new (51202, RaidDifficultiesLegacy10Heroic),
                new (51203, RaidDifficultiesLegacy10Heroic),
                new (51204, RaidDifficultiesLegacy10Heroic),
                new (51210, RaidDifficultiesLegacy10Heroic),
                new (51211, RaidDifficultiesLegacy10Heroic),
                new (51212, RaidDifficultiesLegacy10Heroic),
                new (51213, RaidDifficultiesLegacy10Heroic),
                new (51214, RaidDifficultiesLegacy10Heroic),
                new (51215, RaidDifficultiesLegacy10Heroic),
                new (51216, RaidDifficultiesLegacy10Heroic),
                new (51217, RaidDifficultiesLegacy10Heroic),
                new (51218, RaidDifficultiesLegacy10Heroic),
                new (51219, RaidDifficultiesLegacy10Heroic),

                // Protector's Mark of Sanctification [25H]
                new (51220, RaidDifficultiesLegacy25Heroic),
                new (51221, RaidDifficultiesLegacy25Heroic),
                new (51222, RaidDifficultiesLegacy25Heroic),
                new (51223, RaidDifficultiesLegacy25Heroic),
                new (51224, RaidDifficultiesLegacy25Heroic),
                new (51225, RaidDifficultiesLegacy25Heroic),
                new (51226, RaidDifficultiesLegacy25Heroic),
                new (51227, RaidDifficultiesLegacy25Heroic),
                new (51228, RaidDifficultiesLegacy25Heroic),
                new (51229, RaidDifficultiesLegacy25Heroic),
                new (51235, RaidDifficultiesLegacy25Heroic),
                new (51236, RaidDifficultiesLegacy25Heroic),
                new (51237, RaidDifficultiesLegacy25Heroic),
                new (51238, RaidDifficultiesLegacy25Heroic),
                new (51239, RaidDifficultiesLegacy25Heroic),
                new (51240, RaidDifficultiesLegacy25Heroic),
                new (51241, RaidDifficultiesLegacy25Heroic),
                new (51242, RaidDifficultiesLegacy25Heroic),
                new (51243, RaidDifficultiesLegacy25Heroic),
                new (51244, RaidDifficultiesLegacy25Heroic),
                new (51245, RaidDifficultiesLegacy25Heroic),
                new (51246, RaidDifficultiesLegacy25Heroic),
                new (51247, RaidDifficultiesLegacy25Heroic),
                new (51248, RaidDifficultiesLegacy25Heroic),
                new (51249, RaidDifficultiesLegacy25Heroic),
                new (51285, RaidDifficultiesLegacy25Heroic),
                new (51286, RaidDifficultiesLegacy25Heroic),
                new (51287, RaidDifficultiesLegacy25Heroic),
                new (51288, RaidDifficultiesLegacy25Heroic),
                new (51289, RaidDifficultiesLegacy25Heroic),

                // Vanquisher's Mark of Sanctification [10H]
                new (51125, RaidDifficultiesLegacy10Heroic),
                new (51126, RaidDifficultiesLegacy10Heroic),
                new (51127, RaidDifficultiesLegacy10Heroic),
                new (51128, RaidDifficultiesLegacy10Heroic),
                new (51129, RaidDifficultiesLegacy10Heroic),
                new (51130, RaidDifficultiesLegacy10Heroic),
                new (51131, RaidDifficultiesLegacy10Heroic),
                new (51132, RaidDifficultiesLegacy10Heroic),
                new (51133, RaidDifficultiesLegacy10Heroic),
                new (51134, RaidDifficultiesLegacy10Heroic),
                new (51135, RaidDifficultiesLegacy10Heroic),
                new (51136, RaidDifficultiesLegacy10Heroic),
                new (51137, RaidDifficultiesLegacy10Heroic),
                new (51138, RaidDifficultiesLegacy10Heroic),
                new (51139, RaidDifficultiesLegacy10Heroic),
                new (51140, RaidDifficultiesLegacy10Heroic),
                new (51141, RaidDifficultiesLegacy10Heroic),
                new (51142, RaidDifficultiesLegacy10Heroic),
                new (51143, RaidDifficultiesLegacy10Heroic),
                new (51144, RaidDifficultiesLegacy10Heroic),
                new (51145, RaidDifficultiesLegacy10Heroic),
                new (51146, RaidDifficultiesLegacy10Heroic),
                new (51147, RaidDifficultiesLegacy10Heroic),
                new (51148, RaidDifficultiesLegacy10Heroic),
                new (51149, RaidDifficultiesLegacy10Heroic),
                new (51155, RaidDifficultiesLegacy10Heroic),
                new (51156, RaidDifficultiesLegacy10Heroic),
                new (51157, RaidDifficultiesLegacy10Heroic),
                new (51158, RaidDifficultiesLegacy10Heroic),
                new (51159, RaidDifficultiesLegacy10Heroic),
                new (51185, RaidDifficultiesLegacy10Heroic),
                new (51186, RaidDifficultiesLegacy10Heroic),
                new (51187, RaidDifficultiesLegacy10Heroic),
                new (51188, RaidDifficultiesLegacy10Heroic),
                new (51189, RaidDifficultiesLegacy10Heroic),

                // Vanquisher's Mark of Sanctification [25H]
                new (51250, RaidDifficultiesLegacy25Heroic),
                new (51251, RaidDifficultiesLegacy25Heroic),
                new (51252, RaidDifficultiesLegacy25Heroic),
                new (51253, RaidDifficultiesLegacy25Heroic),
                new (51254, RaidDifficultiesLegacy25Heroic),
                new (51280, RaidDifficultiesLegacy25Heroic),
                new (51281, RaidDifficultiesLegacy25Heroic),
                new (51282, RaidDifficultiesLegacy25Heroic),
                new (51283, RaidDifficultiesLegacy25Heroic),
                new (51284, RaidDifficultiesLegacy25Heroic),
                new (51290, RaidDifficultiesLegacy25Heroic),
                new (51291, RaidDifficultiesLegacy25Heroic),
                new (51292, RaidDifficultiesLegacy25Heroic),
                new (51293, RaidDifficultiesLegacy25Heroic),
                new (51294, RaidDifficultiesLegacy25Heroic),
                new (51295, RaidDifficultiesLegacy25Heroic),
                new (51296, RaidDifficultiesLegacy25Heroic),
                new (51297, RaidDifficultiesLegacy25Heroic),
                new (51298, RaidDifficultiesLegacy25Heroic),
                new (51299, RaidDifficultiesLegacy25Heroic),
                new (51300, RaidDifficultiesLegacy25Heroic),
                new (51301, RaidDifficultiesLegacy25Heroic),
                new (51302, RaidDifficultiesLegacy25Heroic),
                new (51303, RaidDifficultiesLegacy25Heroic),
                new (51304, RaidDifficultiesLegacy25Heroic),
                new (51305, RaidDifficultiesLegacy25Heroic),
                new (51306, RaidDifficultiesLegacy25Heroic),
                new (51307, RaidDifficultiesLegacy25Heroic),
                new (51308, RaidDifficultiesLegacy25Heroic),
                new (51309, RaidDifficultiesLegacy25Heroic),
                new (51310, RaidDifficultiesLegacy25Heroic),
                new (51311, RaidDifficultiesLegacy25Heroic),
                new (51312, RaidDifficultiesLegacy25Heroic),
                new (51313, RaidDifficultiesLegacy25Heroic),
                new (51314, RaidDifficultiesLegacy25Heroic),
            }
        },
        #endregion

        #region Wrath of the Lich King Trash
        // Halls of Reflection > Trash
        {
            1000276,
            FrozenHallsTrashDrops
        },
        // Pit of Saron > Trash
        {
            1000278,
            FrozenHallsTrashDrops
        },
        // Forge of Souls > Trash
        {
            1000280,
            FrozenHallsTrashDrops
        },
        // Naxxramas > Trash
        {
            1000754,
            new List<ExtraItemDrop>
            {
                // Leather
                new (40409, RaidDifficultiesLegacy25Normal), // Boots of the Escaped Captive
                // Plate
                new (39467, RaidDifficultiesLegacy10Normal), // Minion Bracers
                new (40414, RaidDifficultiesLegacy25Normal), // Shoulderguards of the Undaunted
                // Cloak
                new (40410, RaidDifficultiesLegacy25Normal), // Shadow of the Ghoul
                // Weapon
                new (39473, RaidDifficultiesLegacy10Normal), // Contortion
                new (40408, RaidDifficultiesLegacy25Normal), // Haunting Call
                new (40406, RaidDifficultiesLegacy25Normal), // Inevitable Defeat
                new (39427, RaidDifficultiesLegacy10Normal), // Omen of Ruin
                new (40407, RaidDifficultiesLegacy25Normal), // Silent Crusader
                new (39468, RaidDifficultiesLegacy10Normal), // The Stray
            }
        },
        // Ulduar > Trash
        {
            1000759,
            new List<ExtraItemDrop>
            {
                // Cloth
                new (45549, RaidDifficultiesNormal), // Grips of Chaos
                new (46344, RaidDifficultiesNormal), // Iceshear Mantle
                // Leather
                new (45548, RaidDifficultiesNormal), // Belt of the Sleeper
                new (45547, RaidDifficultiesNormal), // Relic Hunter's Cord
                // Mail
                new (46346, RaidDifficultiesNormal), // Boots of Unsettled Prey
                new (45544, RaidDifficultiesNormal), // Leggings of the Tortured Earth
                new (45543, RaidDifficultiesNormal), // Shoulders of Misfortune
                // Plate
                new (46345, RaidDifficultiesNormal), // Bracers of Righteous Reformation
                new (46340, RaidDifficultiesNormal), // Adamant Handguards
                new (45542, RaidDifficultiesNormal), // Greaves of the Stonewarder
                // Cloak
                new (46347, RaidDifficultiesNormal), // Cloak of the Dormant Blaze
                new (46341, RaidDifficultiesNormal), // Drape of the Spellweaver
                new (45541, RaidDifficultiesNormal), // Shroud of Alteration
                // Weapon
                new (46351, RaidDifficultiesNormal), // Bloodcrush Cudgel
                new (45605, RaidDifficultiesNormal), // Daschal's Bite
                new (46342, RaidDifficultiesNormal), // Golemheart Longbow
                new (46339, RaidDifficultiesNormal), // Mimiron's Repeater
                new (46350, RaidDifficultiesNormal), // Pillar of Fortitude
            }
        },
        {
            1000758, // Icecrown Citadel > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (50449, RaidDifficultiesLegacy25Normal), // Stiffened Corpse Shoulderpads
                // Mail
                new (50450, RaidDifficultiesLegacy25Normal), // Leggings of Dubious Charms
                // Plate
                new (50451, RaidDifficultiesLegacy25Normal), // Belt of the Lonely Noble
                // Weapon
                new (50444, RaidDifficultiesLegacy25Normal), // Rowan's Rifle of Silver Bullets
            }
        },
        #endregion

        #region Cataclysm
        // Firelands > Majordomo Staghelm
        {
            197,
            new List<ExtraItemDrop>
            {
                new(122304, new[]{ 14, 15, 33 }), // Fandral's Seed Pouch
            }
        },
        #endregion

        #region Cataclysm Trash
        {
            1000072, // The Bastion of Twilight > Trash
            new List<ExtraItemDrop>
            {
                new (60211, RaidDifficultiesNormal), // Bracers of the Dark Pool
                new (60202, RaidDifficultiesNormal), // Tsanga's Helm
                new (60201, RaidDifficultiesNormal), // Phase-Twister Leggings
                new (59901, RaidDifficultiesNormal), // Heaving Plates of Protection
                new (59520, RaidDifficultiesNormal), // Unheeded Warning
                new (59521, RaidDifficultiesNormal), // Soul Blade
                new (59525, RaidDifficultiesNormal), // Chelley's Staff of Dark Mending
                new (60210, RaidDifficultiesNormal), // Crossfire Carbine
            }
        },
        {
            1000073, // Blackwing Depths > Trash
            new List<ExtraItemDrop>
            {
                new (59466, RaidDifficultiesNormal), // Ironstar's Impenetrable Cover
                new (59468, RaidDifficultiesNormal), // Shadowforge's Lightbound Smock
                new (59467, RaidDifficultiesNormal), // Hide of Chromaggus
                new (59465, RaidDifficultiesNormal), // Corehammer's Riveted Girdle
                new (59464, RaidDifficultiesNormal), // Treads of Savage Beatings
                new (59461, RaidDifficultiesNormal), // Fury of Angerforge
                new (59462, RaidDifficultiesNormal), // Maimgor's Bite
                new (59463, RaidDifficultiesNormal), // Maldo's Sword Cane
                new (63537, RaidDifficultiesNormal), // Claws of Torment
                new (63538, RaidDifficultiesNormal), // Claws of Agony
                new (68601, RaidDifficultiesNormal), // Scaleslicer
                new (59460, RaidDifficultiesNormal), // Theresa's Booklight
            }
        },
        {
            1000078, // Firelands > Trash
            new List<ExtraItemDrop>
            {
                // Leather
                new (71640, RaidDifficultiesNormal), // Riplimb's Lost Collar
                //new (71641, new[] { 15 }), // Riplimb's Lost Collar
                // Mail
                new (71365, RaidDifficultiesNormal), // Hide-Bound Chains
                //new (71561, new[] { 15 }), // Hide-Bound Chains
                // Weapon
                new (71359, RaidDifficultiesNormal), // Chelley's Sterilized Scalpel
                //new (71560, new[] { 15 }), // Chelley's Sterilized Scalpel
                new (71366, RaidDifficultiesNormal), // Lava Bolt Crossbow
                //new (71558, new[] { 15 }), // Lava Bolt Crossbow
                new (71362, RaidDifficultiesNormal), // Obsidium Cleaver
                //new (71562, new[] { 15 }), // Obsidium Cleaver
                new (71361, RaidDifficultiesNormal), // Ranseur of Hatred
                //new (71557, new[] { 15 }), // Ranseur of Hatred
                new (71360, RaidDifficultiesNormal), // Spire of Scarlet Pain
                //new (71559, new[] { 15 }), // Spire of Scarlet Pain
            }
        },
        {
            1000187, // Dragon Soul > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (78879, RaidDifficultiesNormal), // Sash of Relentless Truth
                // Leather
                new (78884, RaidDifficultiesNormal), // Girdle of Fungal Dreams
                new (78882, RaidDifficultiesNormal), // Nightblind Cinch
                // Mail
                new (78886, RaidDifficultiesNormal), // Belt of Ghostly Graces
                new (78885, RaidDifficultiesNormal), // Dragoncarver Belt
                // Plate
                new (78887, RaidDifficultiesNormal), // Girdle of Soulful Mending
                new (78888, RaidDifficultiesNormal), // Waistguard of Bleeding Bone
                new (78889, RaidDifficultiesNormal), // Waistplate of the Desecrated Future
                // Weapon
                new (77938, RaidDifficultiesNormal), // Dragonfire Orb
                new (77192, RaidDifficultiesNormal), // Ruinblaster Shotgun
                new (78878, RaidDifficultiesNormal), // Spine of the Thousand Cuts
            }
        },

        #endregion

        #region Mists of Pandaria
        // Scholomance > Doctor Theolen Krastinov
        {
            102460,
            new List<ExtraItemDrop>
            {
                new(88566, DungeonDifficultiesHeroic), // Krastinov's Bag of Horrors - Heroic
            }
        },
        // Siege of Orgrimmar > Garrosh Hellscream
        {
            869,
            new List<ExtraItemDrop>
            {
                new(112935, new[]{ 16 }), // Tusks of Mannoroth - Mythic
            }
        },
        // World Bosses > Salyis's Warband (Galleon)
        {
            725,
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        #endregion

        #region Mists of Pandaria Trash
        {
            1000330, // Heart of Fear > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (86850, new[]{ 17 }), // Darting Damselfly Cuffs
                new (86192, RaidDifficultiesNormal), // Darting Damselfly Cuffs
                new (86844, new[]{ 17 }), // Gleaming Moth Cuffs
                new (86186, RaidDifficultiesNormal), // Gleaming Moth Cuffs
                new (86841, new[]{ 17 }), // Shining Cicada Bracers
                new (86183, RaidDifficultiesNormal), // Shining Cicada Bracers
                // Leather
                new (86845, new[]{ 17 }), // Pearlescent Butterfly Wristbands
                new (86187, RaidDifficultiesNormal), // Pearlescent Butterfly Wristbands
                new (86843, new[]{ 17 }), // Smooth Beetle Wristbands
                new (86185, RaidDifficultiesNormal), // Smooth Beetle Wristbands
                // Mail
                new (86847, new[]{ 17 }), // Jagged Hornet Bracers
                new (86189, RaidDifficultiesNormal), // Jagged Hornet Bracers
                new (86842, new[]{ 17 }), // Luminescent Firefly Wristguards
                new (86184, RaidDifficultiesNormal), // Luminescent Firefly Wristguards
                // Plate
                new (86846, new[]{ 17 }), // Inlaid Cricket Bracers
                new (86188, RaidDifficultiesNormal), // Inlaid Cricket Bracers
                new (86849, new[]{ 17 }), // Plated Locust Bracers
                new (86191, RaidDifficultiesNormal), // Plated Locust Bracers
                new (86848, new[]{ 17 }), // Serrated Wasp Bracers
                new (86190, RaidDifficultiesNormal), // Serrated Wasp Bracers
            }
        },
        {
            1000362, // Throne of Thunder > Trash
            new List<ExtraItemDrop>
            {
                // Toy
                new (98136, RaidDifficultiesLfrNormalHeroic), // Gastropod Shell
                // Cloth
                new (95207, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Firecord
                new (95208, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Shadowgirdle
                new (95224, RaidDifficultiesLfrNormalHeroic), // Home-Warding Slippers
                new (95223, RaidDifficultiesLfrNormalHeroic), // Silentflame Sandals
                // Leather
                new (95210, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Moonstrap
                new (95209, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Silentbelt
                new (95221, RaidDifficultiesLfrNormalHeroic), // Deeproot Treads
                new (95219, RaidDifficultiesLfrNormalHeroic), // Spiderweb Tabi
                // Mail
                new (95211, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Arrowlinks
                new (95212, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Waterchain
                new (95220, RaidDifficultiesLfrNormalHeroic), // Scalehide Spurs
                new (95222, RaidDifficultiesLfrNormalHeroic), // Spiritbound Boots
                // Plate
                new (95215, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Bucklebreaker
                new (95214, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Goreplate
                new (95213, RaidDifficultiesLfrNormalHeroic), // Abandoned Zandalari Greatbelt
                new (95218, RaidDifficultiesLfrNormalHeroic), // Columnbreaker Stompers
                new (95217, RaidDifficultiesLfrNormalHeroic), // Locksmasher Greaves
                new (95216, RaidDifficultiesLfrNormalHeroic), // Vaultwalker Sabatons
            }
        },
        {
            1000369, // Siege of Orgrimmar > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new (113225, RaidDifficultiesAll), // Kalaena's Arcane Handwraps
                new (113218, RaidDifficultiesAll), // Seebo's Sainted Touch
                // Leather
                new (113220, RaidDifficultiesAll), // Crimson Gauntlets of Death
                new (113221, RaidDifficultiesAll), // Siid's Silent Stranglers
                // Mail
                new (113222, RaidDifficultiesAll), // Keengrip Arrowpullers
                new (113227, RaidDifficultiesAll), // Marco's Crackling Gloves
                // Plate
                new (113228, RaidDifficultiesAll), // Gauntlets of Discarded Time
                new (113219, RaidDifficultiesAll), // Romy's Reliable Grips
                new (113229, RaidDifficultiesAll), // Zoid's Molten Gauntlets
                // Cloak
                new (113224, RaidDifficultiesAll), // Aeth's Swiftcinder Cloak
                new (113231, RaidDifficultiesAll), // Brave Niunai's Cloak
                new (113226, RaidDifficultiesAll), // Cape of the Alpha
                new (113230, RaidDifficultiesAll), // Drape of the Omega
                new (113223, RaidDifficultiesAll), // Turtleshell Greatcloak
            }
        },
        #endregion

        #region Warlords of Draenor Trash
        {
            1000477, // Highmaul > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1000457, // Blackrock Foundry > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1000669, // Hellfire Citadel > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        #endregion

        #region Legion
        // Return to Karazhan > Nightbane
        {
            108600,
            new List<ExtraItemDrop>
            {
                // Mount
                new(142552, new[]{ 23 }), // Smoldering Ember Wyrm
                // Cloth
                new(142297, new[]{ 23 }), // Robes of the Ancient Chronicle
                // Leather
                new(142203, new[]{ 23 }), // Harness of Smoldering Betrayal
                // Mail
                new(142301, new[]{ 23 }), // Hauberk of Warped Intuition
                // Plate
                new(142303, new[]{ 23 }), // Chestplate of Impenetrable Darkness
            }
        },
        // Seat of the Triumvirate > Vixx the Collector
        {
            109450,
            new List<ExtraItemDrop>
            {
                new(153004, new[] { 2, 23 }), // Unstable Portal Emitter
                new(152982, new[] { 2, 23 }), // Vixx's Chest of Tricks
            }
        },
        // The Nighthold > Gul'dan
        {
            1737,
            new List<ExtraItemDrop>
            {
                new(119211, RaidDifficultiesAll), // Golden Hearthstone Card: Lord Jaraxxus
                new(143544, RaidDifficultiesAll), // Skull of Corruption
            }
        },
        // Tomb of Sargeras > Maiden of Vigilance
        {
            1897,
            new List<ExtraItemDrop>
            {
                new(151524, RaidDifficultiesAll), // Hammer of Vigilance
            }
        },
        // Antorus, the Burning Throne > Aggramar
        {
            1984,
            new List<ExtraItemDrop>
            {
                new(152094, RaidDifficultiesAll), // Taeshalach
            }
        },
        // Antorus, the Burning Throne > Argus the Unmaker
        {
            2031,
            new List<ExtraItemDrop>
            {
                new(153115, RaidDifficultiesAll), // Scythe of the Unmaker (blue)
                new(155880, new[] { 16 }), // Scythe of the Unmaker (red) - Mythic
            }
        },
        #endregion

        #region Legion Trash
        {
            1000768, // Emerald Nightmare > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new(140993, RaidDifficultiesAll), // Gloves of Murmured Promises
                // Leather
                new(140996, RaidDifficultiesAll), // Grips of Silent Screams
                // Mail
                new(141694, RaidDifficultiesAll), // Gauntlets of Fractured Dreams
                // Plate
                new(141695, RaidDifficultiesAll), // Tarnished Dreamkeeper's Gauntlets
            }
        },
        {
            1000861, // Trial of Valor
            new List<ExtraItemDrop>
            {
                new(142541, RaidDifficultiesAll), // Drape of the Forgotten Souls
            }
        },
        {
            1000786, // The Nighthold > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1000875, // Tomb of Sargeras > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1000946, // Antorus, the Burning Throne > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
                new(153018, RaidDifficultiesAll), // Corrupted Mantle of the Felseekers
                new(152085, RaidDifficultiesAll), // Cuffs of the Viridian Flameweavers
                new(152084, RaidDifficultiesAll), // Gloves of Abhorrent Strategies
                // Leather
                new(152412, RaidDifficultiesAll), // Felflame Inferno Shoulderpads
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
            }
        },
        #endregion

        #region Battle for Azeroth
        // Uldir > Taloc
        {
            2168,
            new List<ExtraItemDrop>
            {
                new(163119, RaidDifficultiesAll), // Khor, Hammer of the Guardian
            }
        },
        // Azeroth > Doom's Howl
        {
            2213,
            new List<ExtraItemDrop>
            {
                new(163828, RaidDifficultiesNormal), // Toy Siege Tower
            }
        },
        // Azeroth > The Lion's Roar
        {
            2214,
            new List<ExtraItemDrop>
            {
                new(163829, RaidDifficultiesNormal), // Toy War Machine
            }
        },
        // The Eternal Palace > Za'qul
        {
            2349,
            new List<ExtraItemDrop>
            {
                new(168868, RaidDifficultiesAll), // Pauldrons of Za'qul
            }
        },
        #endregion

        #region Battle for Azeroth Trash
        {
            1001031, // Uldir > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1001176, // Battle of Dazar'alor > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1001179, // The Eternal Palace > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1001180, // Nya'lotha, the Waking City > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        #endregion

        #region Shadowlands Trash
        {
            1001190, // Castle Nathria > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1001193, // Sanctum of Domination > Trash
            new List<ExtraItemDrop>
            {
                // Cloth
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
            }
        },
        {
            1001195, // Sepulcher of the First Ones > Trash
            new List<ExtraItemDrop>()
            {
                // Cloth
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
            }
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
