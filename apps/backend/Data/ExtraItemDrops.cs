namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        private static readonly int[] RaidDifficultiesAll = { 17, 14, 15, 16 };
        private static readonly int[] RaidDifficultiesLfrNormalHeroic = { 3, 4, 5, 6, 7 };
        private static readonly int[] RaidDifficultiesNoLfr = { 14, 15, 16 };

        public static readonly Dictionary<int, List<ExtraItemDrop>> ExtraItemDrops = new()
        {
            {
                895, // Razorfen Kraul > Roogug
                new List<ExtraItemDrop>
                {
                    new(151443, new[]{ 1 }), // Roogug's Swinesteel Girdle - Normal
                }
            },
            {
                869, // Siege of Orgrimmar > Garrosh Hellscream
                new List<ExtraItemDrop>
                {
                    new(112935, new[]{ 16 }), // Tusks of Mannoroth - Mythic
                }
            },
            {
                1897, // Tomb of Sargeras > Maiden of Vigilance
                new List<ExtraItemDrop>
                {
                    new(151524, RaidDifficultiesAll), // Hammer of Vigilance
                }
            },
            {
                1984, // Antorus, the Burning Throne > Aggramar
                new List<ExtraItemDrop>
                {
                    new(152094, RaidDifficultiesAll), // Taeshalach
                }
            },
            {
                2031, // Antorus, the Burning Throne > Argus the Unmaker
                new List<ExtraItemDrop>
                {
                    new(153115, RaidDifficultiesAll), // Scythe of the Unmaker (blue)
                    new(155880, new[] { 16 }), // Scythe of the Unmaker (red) - Mythic
                }
            },
            {
                2168, // Uldir > Taloc
                new List<ExtraItemDrop>
                {
                    new(163119, RaidDifficultiesAll), // Khor, Hammer of the Guardian
                }
            },
            {
                2349, // The Eternal Palace > Za'qul
                new List<ExtraItemDrop>
                {
                    new(168868, RaidDifficultiesAll), // Pauldrons of Za'qul
                }
            },

            {
                107580, // Icecrown Citadel > Sanctified T10
                new List<ExtraItemDrop>
                {
                    // Conqueror's Mark of Sanctification [10H]
                    new (51160, new[]{ 5 }),
                    new (51161, new[]{ 5 }),
                    new (51162, new[]{ 5 }),
                    new (51163, new[]{ 5 }),
                    new (51164, new[]{ 5 }),
                    new (51165, new[]{ 5 }),
                    new (51166, new[]{ 5 }),
                    new (51167, new[]{ 5 }),
                    new (51168, new[]{ 5 }),
                    new (51169, new[]{ 5 }),
                    new (51170, new[]{ 5 }),
                    new (51171, new[]{ 5 }),
                    new (51172, new[]{ 5 }),
                    new (51173, new[]{ 5 }),
                    new (51174, new[]{ 5 }),
                    new (51175, new[]{ 5 }),
                    new (51176, new[]{ 5 }),
                    new (51177, new[]{ 5 }),
                    new (51178, new[]{ 5 }),
                    new (51179, new[]{ 5 }),
                    new (51180, new[]{ 5 }),
                    new (51181, new[]{ 5 }),
                    new (51182, new[]{ 5 }),
                    new (51183, new[]{ 5 }),
                    new (51184, new[]{ 5 }),
                    new (51205, new[]{ 5 }),
                    new (51206, new[]{ 5 }),
                    new (51207, new[]{ 5 }),
                    new (51208, new[]{ 5 }),
                    new (51209, new[]{ 5 }),

                    // Conqueror's Mark of Sanctification [25H]
                    new (51230, new[]{ 6 }),
                    new (51231, new[]{ 6 }),
                    new (51232, new[]{ 6 }),
                    new (51233, new[]{ 6 }),
                    new (51234, new[]{ 6 }),
                    new (51255, new[]{ 6 }),
                    new (51256, new[]{ 6 }),
                    new (51257, new[]{ 6 }),
                    new (51258, new[]{ 6 }),
                    new (51259, new[]{ 6 }),
                    new (51260, new[]{ 6 }),
                    new (51261, new[]{ 6 }),
                    new (51262, new[]{ 6 }),
                    new (51263, new[]{ 6 }),
                    new (51264, new[]{ 6 }),
                    new (51265, new[]{ 6 }),
                    new (51266, new[]{ 6 }),
                    new (51267, new[]{ 6 }),
                    new (51268, new[]{ 6 }),
                    new (51269, new[]{ 6 }),
                    new (51270, new[]{ 6 }),
                    new (51271, new[]{ 6 }),
                    new (51272, new[]{ 6 }),
                    new (51273, new[]{ 6 }),
                    new (51274, new[]{ 6 }),
                    new (51275, new[]{ 6 }),
                    new (51276, new[]{ 6 }),
                    new (51277, new[]{ 6 }),
                    new (51278, new[]{ 6 }),
                    new (51279, new[]{ 6 }),

                    // Protector's Mark of Sanctification [10H]
                    new (51150, new[]{ 5 }),
                    new (51151, new[]{ 5 }),
                    new (51152, new[]{ 5 }),
                    new (51153, new[]{ 5 }),
                    new (51154, new[]{ 5 }),
                    new (51190, new[]{ 5 }),
                    new (51191, new[]{ 5 }),
                    new (51192, new[]{ 5 }),
                    new (51193, new[]{ 5 }),
                    new (51194, new[]{ 5 }),
                    new (51195, new[]{ 5 }),
                    new (51196, new[]{ 5 }),
                    new (51197, new[]{ 5 }),
                    new (51198, new[]{ 5 }),
                    new (51199, new[]{ 5 }),
                    new (51200, new[]{ 5 }),
                    new (51201, new[]{ 5 }),
                    new (51202, new[]{ 5 }),
                    new (51203, new[]{ 5 }),
                    new (51204, new[]{ 5 }),
                    new (51210, new[]{ 5 }),
                    new (51211, new[]{ 5 }),
                    new (51212, new[]{ 5 }),
                    new (51213, new[]{ 5 }),
                    new (51214, new[]{ 5 }),
                    new (51215, new[]{ 5 }),
                    new (51216, new[]{ 5 }),
                    new (51217, new[]{ 5 }),
                    new (51218, new[]{ 5 }),
                    new (51219, new[]{ 5 }),

                    // Protector's Mark of Sanctification [25H]
                    new (51220, new[]{ 6 }),
                    new (51221, new[]{ 6 }),
                    new (51222, new[]{ 6 }),
                    new (51223, new[]{ 6 }),
                    new (51224, new[]{ 6 }),
                    new (51225, new[]{ 6 }),
                    new (51226, new[]{ 6 }),
                    new (51227, new[]{ 6 }),
                    new (51228, new[]{ 6 }),
                    new (51229, new[]{ 6 }),
                    new (51235, new[]{ 6 }),
                    new (51236, new[]{ 6 }),
                    new (51237, new[]{ 6 }),
                    new (51238, new[]{ 6 }),
                    new (51239, new[]{ 6 }),
                    new (51240, new[]{ 6 }),
                    new (51241, new[]{ 6 }),
                    new (51242, new[]{ 6 }),
                    new (51243, new[]{ 6 }),
                    new (51244, new[]{ 6 }),
                    new (51245, new[]{ 6 }),
                    new (51246, new[]{ 6 }),
                    new (51247, new[]{ 6 }),
                    new (51248, new[]{ 6 }),
                    new (51249, new[]{ 6 }),
                    new (51285, new[]{ 6 }),
                    new (51286, new[]{ 6 }),
                    new (51287, new[]{ 6 }),
                    new (51288, new[]{ 6 }),
                    new (51289, new[]{ 6 }),

                    // Vanquisher's Mark of Sanctification [10H]
                    new (51125, new[]{ 5 }),
                    new (51126, new[]{ 5 }),
                    new (51127, new[]{ 5 }),
                    new (51128, new[]{ 5 }),
                    new (51129, new[]{ 5 }),
                    new (51130, new[]{ 5 }),
                    new (51131, new[]{ 5 }),
                    new (51132, new[]{ 5 }),
                    new (51133, new[]{ 5 }),
                    new (51134, new[]{ 5 }),
                    new (51135, new[]{ 5 }),
                    new (51136, new[]{ 5 }),
                    new (51137, new[]{ 5 }),
                    new (51138, new[]{ 5 }),
                    new (51139, new[]{ 5 }),
                    new (51140, new[]{ 5 }),
                    new (51141, new[]{ 5 }),
                    new (51142, new[]{ 5 }),
                    new (51143, new[]{ 5 }),
                    new (51144, new[]{ 5 }),
                    new (51145, new[]{ 5 }),
                    new (51146, new[]{ 5 }),
                    new (51147, new[]{ 5 }),
                    new (51148, new[]{ 5 }),
                    new (51149, new[]{ 5 }),
                    new (51155, new[]{ 5 }),
                    new (51156, new[]{ 5 }),
                    new (51157, new[]{ 5 }),
                    new (51158, new[]{ 5 }),
                    new (51159, new[]{ 5 }),
                    new (51185, new[]{ 5 }),
                    new (51186, new[]{ 5 }),
                    new (51187, new[]{ 5 }),
                    new (51188, new[]{ 5 }),
                    new (51189, new[]{ 5 }),

                    // Vanquisher's Mark of Sanctification [25H]
                    new (51250, new[]{ 6 }),
                    new (51251, new[]{ 6 }),
                    new (51252, new[]{ 6 }),
                    new (51253, new[]{ 6 }),
                    new (51254, new[]{ 6 }),
                    new (51280, new[]{ 6 }),
                    new (51281, new[]{ 6 }),
                    new (51282, new[]{ 6 }),
                    new (51283, new[]{ 6 }),
                    new (51284, new[]{ 6 }),
                    new (51290, new[]{ 6 }),
                    new (51291, new[]{ 6 }),
                    new (51292, new[]{ 6 }),
                    new (51293, new[]{ 6 }),
                    new (51294, new[]{ 6 }),
                    new (51295, new[]{ 6 }),
                    new (51296, new[]{ 6 }),
                    new (51297, new[]{ 6 }),
                    new (51298, new[]{ 6 }),
                    new (51299, new[]{ 6 }),
                    new (51300, new[]{ 6 }),
                    new (51301, new[]{ 6 }),
                    new (51302, new[]{ 6 }),
                    new (51303, new[]{ 6 }),
                    new (51304, new[]{ 6 }),
                    new (51305, new[]{ 6 }),
                    new (51306, new[]{ 6 }),
                    new (51307, new[]{ 6 }),
                    new (51308, new[]{ 6 }),
                    new (51309, new[]{ 6 }),
                    new (51310, new[]{ 6 }),
                    new (51311, new[]{ 6 }),
                    new (51312, new[]{ 6 }),
                    new (51313, new[]{ 6 }),
                    new (51314, new[]{ 6 }),
                }
            },

            #region Miscellaneous
            {
                // Darkmaul Citadel
                100010, // Tunk
                new List<ExtraItemDrop>
                {
                    new (178162, new[]{ 1 }), // Tunk's Whomper
                    new (178163, new[]{ 1 }), // Tunk's Shinguard
                    new (178164, new[]{ 1 }), // Tunk's Needle
                    new (178165, new[]{ 1 }), // Tunk's Tooth
                    new (178166, new[]{ 1 }), // Tunk's Toothpick
                    new (178167, new[]{ 1 }), // Tunk's Lil' Whomper
                    new (179360, new[]{ 1 }), // Tunk's Tiny Bow
                    //new (179362, new[]{ 1 }), // Tunk's Backscratcher -- doesn't actually exist
                }
            },
            {
                100011, // Gor'groth
                new List<ExtraItemDrop>
                {
                    new (178169, new[]{ 1 }), // Decrepit Dragonscale Drape
                }
            },
            #endregion

            #region Classic Trash
            {
                1000741, // Molten Core > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (16802, new[]{ 9 }), // Arcanist Belt
                    new (16799, new[]{ 9 }), // Arcanist Bindings
                    new (16817, new[]{ 9 }), // Girdle of Prophecy
                    new (16806, new[]{ 9 }), // Felheart Belt
                    new (16804, new[]{ 9 }), // Felheart Bracers
                    new (16819, new[]{ 9 }), // Vambraces of Prophecy
                    // Leather
                    new (16828, new[]{ 9 }), // Cenarion Belt
                    new (16830, new[]{ 9 }), // Cenarion Bracers
                    new (16827, new[]{ 9 }), // Nightslayer Belt
                    new (16825, new[]{ 9 }), // Nightslayer Bracelets
                    // Mail
                    new (16838, new[]{ 9 }), // Earthfury Belt
                    new (16840, new[]{ 9 }), // Earthfury Bracers
                    new (16851, new[]{ 9 }), // Giantstalker's Belt
                    new (16850, new[]{ 9 }), // Giantstalker's Bracers
                    // Plate
                    new (16864, new[]{ 9 }), // Belt of Might
                    new (16861, new[]{ 9 }), // Bracers of Might
                    new (16858, new[]{ 9 }), // Lawbringer Belt
                    new (16857, new[]{ 9 }), // Lawbringer Bracers
                }
            },
            {
                1000742, // Blackwing Lair > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (19437, new[]{ 9 }), // Boots of Pure Thought
                    new (19438, new[]{ 9 }), // Ringo's Blizzard Boots
                    // Leather
                    new (19439, new[]{ 9 }), // Interlaced Shadow Jerkin
                    // Cloak
                    new (19436, new[]{ 9 }), // Cloak of Draconic Might
                    // Weapon
                    new (19362, new[]{ 9 }), // Doom's Edge
                    new (19354, new[]{ 9 }), // Draconic Avenger
                    new (19358, new[]{ 9 }), // Draconic Maul
                    new (19435, new[]{ 9 }), // Essence Gatherer
                }
            },
            {
                1000744, // Temple of Ahn'Qiraj > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (21838, new[]{ 9 }), // Garb of Royal Ascension
                    new (21888, new[]{ 9 }), // Gloves of the Immortal
                    // Plate
                    new (21889, new[]{ 9 }), // Gloves of the Redeemed Prophecy
                    // Weapon
                    new (21837, new[]{ 9 }), // Anubisath Warhammer
                    new (21856, new[]{ 9 }), // Neretzek, The Blood Drinker
                }
            },
            #endregion

            #region Burning Crusade Trash
            {
                1000745, // Karazhan > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (30668, new[] { 3 }), // Grasp of the Dead
                    new (30673, new[] { 3 }), // Inferno Waist Cord
                    // Leather
                    new (30644, new[] { 3 }), // Grips of Deftness
                    new (30674, new[] { 3 }), // Zierhut's Lost Treads
                    // Mail
                    new (30643, new[] { 3 }), // Belt of the Tracker
                    // Plate
                    new (30641, new[] { 3 }), // Boots of Elusion
                    // Cloak
                    new (30642, new[] { 3 }), // Drape of the Righteous
                }
            },
            {
                1000748, // Serpentshrine Cavern > Trash
                new List<ExtraItemDrop>
                {
                    // Plate
                    new (30027, new[] { 9 }), // Boots of Courage Unending
                    // Weapon
                    new (30021, new[] { 9 }), // Wildfury Greatstaff
                }
            },
            {
                1000749, // The Eye > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (30020, new[] { 9 }), // Fire-Cord of the Magus
                    new (30024, new[] { 9 }), // Mantle of the Elven Kings
                    // Leather
                    new (30029, new[] { 9 }), // Bark-Gloves of Ancient Wisdom
                    // Mail
                    new (30026, new[] { 9 }), // Bands of the Celestial Archer
                    new (30030, new[] { 9 }), // Girdle of Fallen Stars
                }
            },
            {
                1000750, // The Battle for Mount Hyjal > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (32609, new[] { 9 }), // Boots of the Divine Light
                    // Mail
                    new (32592, new[] { 9 }), // Chestguard of Relentless Storms
                    // Cloak
                    new (32590, new[] { 9 }), // Nethervoid Cloak
                    new (34010, new[] { 9 }), // Pepe's Shroud of Pacification
                    // Weapon
                    new (34009, new[] { 9 }), // Hammer of Judgement
                    new (32946, new[] { 9 }), // Claw of Molten Fury
                    new (32945, new[] { 9 }), // Fist of Molten Fury
                }
            },
            {
                1000751, // Black Temple > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (32609, new[] { 9 }), // Boots of the Divine Light
                    // Leather
                    new (32593, new[] { 9 }), // Treads of the Den Mother
                    // Mail
                    new (32592, new[] { 9 }), // Chestguard of Relentless Storms
                    // Plate
                    new (32606, new[] { 9 }), // Girdle of the Lightbearer
                    new (32608, new[] { 9 }), // Pillager's Gauntlets
                    // Cloak
                    new (32590, new[] { 9 }), // Nethervoid Cloak
                    new (34012, new[] { 9 }), // Shroud of the Final Stand
                    // Weapon
                    new (34009, new[] { 9 }), // Hammer of Judgement
                    new (32943, new[] { 9 }), // Swiftsteel Bludgeon
                    new (34011, new[] { 9 }), // Illidari Runeshield
                }
            },
            {
                1000752, // Sunwell Plateau > Trash
                new List<ExtraItemDrop>
                {
                    // Leather
                    new (34351, new[] { 9 }), // Tranquil Majesty Wraps
                    new (34407, new[] { 9 }), // Tranquil Moonlight Wraps
                    // Mail
                    new (34350, new[] { 9 }), // Gauntlets of the Ancient Shadowmoon
                    new (34409, new[] { 9 }), // Gauntlets of the Ancient Frostwolf
                    // Weapon
                    new (34346, new[] { 9 }), // Mounting Vengeance
                    new (34183, new[] { 9 }), // Shivering Felspine
                    new (34348, new[] { 9 }), // Wand of Cleansing Light
                    new (34347, new[] { 9 }), // Wand of the Demonsoul
                }
            },
            #endregion

            #region Wrath of the Lich King Trash
            {
                1000754, // Naxxramas > Trash
                new List<ExtraItemDrop>
                {
                    // Leather
                    new (40409, new[] { 4 }), // Boots of the Escaped Captive
                    // Plate
                    new (39467, new[] { 3 }), // Minion Bracers
                    new (40414, new[] { 4 }), // Shoulderguards of the Undaunted
                    // Cloak
                    new (40410, new[] { 4 }), // Shadow of the Ghoul
                    // Weapon
                    new (39473, new[] { 3 }), // Contortion
                    new (40408, new[] { 4 }), // Haunting Call
                    new (40406, new[] { 4 }), // Inevitable Defeat
                    new (39427, new[] { 3 }), // Omen of Ruin
                    new (40407, new[] { 4 }), // Silent Crusader
                    new (39468, new[] { 3 }), // The Stray
                }
            },
            {
                1000759, // Ulduar > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (45549, new[] { 4 }), // Grips of Chaos
                    new (46344, new[] { 3 }), // Iceshear Mantle
                    // Leather
                    new (45548, new[] { 4 }), // Belt of the Sleeper
                    new (45547, new[] { 4 }), // Relic Hunter's Cord
                    // Mail
                    new (46346, new[] { 3 }), // Boots of Unsettled Prey
                    new (45544, new[] { 4 }), // Leggings of the Tortured Earth
                    new (45543, new[] { 4 }), // Shoulders of Misfortune
                    // Plate
                    new (46345, new[] { 3 }), // Bracers of Righteous Reformation
                    new (46340, new[] { 3 }), // Adamant Handguards
                    new (45542, new[] { 4 }), // Greaves of the Stonewarder
                    // Cloak
                    new (46347, new[] { 3 }), // Cloak of the Dormant Blaze
                    new (46341, new[] { 3 }), // Drape of the Spellweaver
                    new (45541, new[] { 4 }), // Shroud of Alteration
                    // Weapon
                    new (46351, new[] { 3 }), // Bloodcrush Cudgel
                    new (45605, new[] { 4 }), // Daschal's Bite
                    new (46342, new[] { 3 }), // Golemheart Longbow
                    new (46339, new[] { 3 }), // Mimiron's Repeater
                    new (46350, new[] { 3 }), // Pillar of Fortitude
                }
            },
            {
                1000758, // Icecrown Citadel > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (50449, new[] { 4 }), // Stiffened Corpse Shoulderpads
                    // Mail
                    new (50450, new[] { 4 }), // Leggings of Dubious Charms
                    // Plate
                    new (50451, new[] { 4 }), // Belt of the Lonely Noble
                    // Weapon
                    new (50444, new[] { 4 }), // Rowan's Rifle of Silver Bullets
                }
            },
            #endregion

            #region Cataclysm Trash
            {
                1000072, // The Bastion of Twilight > Trash
                new List<ExtraItemDrop>
                {
                    new (60211, new[] { 14 }), // Bracers of the Dark Pool
                    new (60202, new[] { 14 }), // Tsanga's Helm
                    new (60201, new[] { 14 }), // Phase-Twister Leggings
                    new (59901, new[] { 14 }), // Heaving Plates of Protection
                    new (59520, new[] { 14 }), // Unheeded Warning
                    new (59521, new[] { 14 }), // Soul Blade
                    new (59525, new[] { 14 }), // Chelley's Staff of Dark Mending
                    new (60210, new[] { 14 }), // Crossfire Carbine
                }
            },
            {
                1000073, // Blackwing Depths > Trash
                new List<ExtraItemDrop>
                {
                    new (59466, new[] { 14 }), // Ironstar's Impenetrable Cover
                    new (59468, new[] { 14 }), // Shadowforge's Lightbound Smock
                    new (59467, new[] { 14 }), // Hide of Chromaggus
                    new (59465, new[] { 14 }), // Corehammer's Riveted Girdle
                    new (59464, new[] { 14 }), // Treads of Savage Beatings
                    new (59461, new[] { 14 }), // Fury of Angerforge
                    new (59462, new[] { 14 }), // Maimgor's Bite
                    new (59463, new[] { 14 }), // Maldo's Sword Cane
                    new (63537, new[] { 14 }), // Claws of Torment
                    new (63538, new[] { 14 }), // Claws of Agony
                    new (68601, new[] { 14 }), // Scaleslicer
                    new (59460, new[] { 14 }), // Theresa's Booklight
                }
            },
            {
                1000078, // Firelands > Trash
                new List<ExtraItemDrop>
                {
                    // Leather
                    new (71640, new[] { 14 }), // Riplimb's Lost Collar
                    new (71641, new[] { 15 }), // Riplimb's Lost Collar
                    // Mail
                    new (71365, new[] { 14 }), // Hide-Bound Chains
                    new (71561, new[] { 15 }), // Hide-Bound Chains
                    // Weapon
                    new (71359, new[] { 14 }), // Chelley's Sterilized Scalpel
                    new (71560, new[] { 15 }), // Chelley's Sterilized Scalpel
                    new (71366, new[] { 14 }), // Lava Bolt Crossbow
                    new (71558, new[] { 15 }), // Lava Bolt Crossbow
                    new (71362, new[] { 14 }), // Obsidium Cleaver
                    new (71562, new[] { 15 }), // Obsidium Cleaver
                    new (71361, new[] { 14 }), // Ranseur of Hatred
                    new (71557, new[] { 15 }), // Ranseur of Hatred
                    new (71360, new[] { 14 }), // Spire of Scarlet Pain
                    new (71559, new[] { 15 }), // Spire of Scarlet Pain
                }
            },
            {
                1000187, // Dragon Soul > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (78879, new[] { 14 }), // Sash of Relentless Truth
                    // Leather
                    new (78884, new[] { 14 }), // Girdle of Fungal Dreams
                    new (78882, new[] { 14 }), // Nightblind Cinch
                    // Mail
                    new (78886, new[] { 14 }), // Belt of Ghostly Graces
                    new (78885, new[] { 14 }), // Dragoncarver Belt
                    // Plate
                    new (78887, new[] { 14 }), // Girdle of Soulful Mending
                    new (78888, new[] { 14 }), // Waistguard of Bleeding Bone
                    new (78889, new[] { 14 }), // Waistplate of the Desecrated Future
                    // Weapon
                    new (77938, new[] { 14 }), // Dragonfire Orb
                    new (77192, new[] { 14 }), // Ruinblaster Shotgun
                    new (78878, new[] { 14 }), // Spine of the Thousand Cuts
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
                    new (86192, new[]{ 14 }), // Darting Damselfly Cuffs
                    new (86844, new[]{ 17 }), // Gleaming Moth Cuffs
                    new (86186, new[]{ 14 }), // Gleaming Moth Cuffs
                    new (86841, new[]{ 17 }), // Shining Cicada Bracers
                    new (86183, new[]{ 14 }), // Shining Cicada Bracers
                    // Leather
                    new (86845, new[]{ 17 }), // Pearlescent Butterfly Wristbands
                    new (86187, new[]{ 14 }), // Pearlescent Butterfly Wristbands
                    new (86843, new[]{ 17 }), // Smooth Beetle Wristbands
                    new (86185, new[]{ 14 }), // Smooth Beetle Wristbands
                    // Mail
                    new (86847, new[]{ 17 }), // Jagged Hornet Bracers
                    new (86189, new[]{ 14 }), // Jagged Hornet Bracers
                    new (86842, new[]{ 17 }), // Luminescent Firefly Wristguards
                    new (86184, new[]{ 14 }), // Luminescent Firefly Wristguards
                    // Plate
                    new (86846, new[]{ 17 }), // Inlaid Cricket Bracers
                    new (86188, new[]{ 14 }), // Inlaid Cricket Bracers
                    new (86849, new[]{ 17 }), // Plated Locust Bracers
                    new (86191, new[]{ 14 }), // Plated Locust Bracers
                    new (86848, new[]{ 17 }), // Serrated Wasp Bracers
                    new (86190, new[]{ 14 }), // Serrated Wasp Bracers
                }
            },
            {
                1000362, // Throne of Thunder > Trash
                new List<ExtraItemDrop>
                {
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

            #region Legion Trash
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
                    new(166518, RaidDifficultiesAll), // Warbeast Hide Cinch
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
}
