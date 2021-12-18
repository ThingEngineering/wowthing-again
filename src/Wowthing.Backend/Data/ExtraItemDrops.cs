using System.Collections.Generic;
using System.Linq;
using Wowthing.Backend.Models.Data.Journal;

namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        private static int[] _raidDifficultiesAll = { 17, 14, 15, 16 };
        private static int[] _raidDifficultiesNoLfr = { 14, 15, 16 };

        //869
        public static readonly Dictionary<int, List<ExtraItemDrop>> ExtraItemDrops = new()
        {
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
                    new(151524, _raidDifficultiesAll), // Hammer of Vigilance
                }
            },
            {
                1984, // Antorus, the Burning Throne > Aggramar
                new List<ExtraItemDrop>
                {
                    new(152094, _raidDifficultiesAll), // Taeshalach
                }
            },
            {
                2031, // Antorus, the Burning Throne > Argus the Unmaker
                new List<ExtraItemDrop>
                {
                    new(153115, _raidDifficultiesAll), // Scythe of the Unmaker (blue)
                    new(155880, new[] { 16 }), // Scythe of the Unmaker (red) - Mythic
                }
            },
            {
                2168, // Uldir > Taloc
                new List<ExtraItemDrop>
                {
                    new(163119, _raidDifficultiesAll), // Khor, Hammer of the Guardian
                }
            },
            {
                2349, // The Eternal Palace > Za'qul
                new List<ExtraItemDrop>
                {
                    new(168868, _raidDifficultiesAll), // Pauldrons of Za'qul
                }
            },

            {
                1, // > Trash
                new List<ExtraItemDrop>
                {
                    new (0, _raidDifficultiesAll), //
                }
            },
            
            #region Classic Trash
            {
                1000741, // Molten Core > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (16802, new int[]{ 9 }), // Arcanist Belt
                    new (16799, new int[]{ 9 }), // Arcanist Bindings
                    new (16817, new int[]{ 9 }), // Girdle of Prophecy
                    new (16806, new int[]{ 9 }), // Felheart Belt
                    new (16804, new int[]{ 9 }), // Felheart Bracers
                    new (16819, new int[]{ 9 }), // Vambraces of Prophecy
                    // Leather
                    new (16828, new int[]{ 9 }), // Cenarion Belt
                    new (16830, new int[]{ 9 }), // Cenarion Bracers
                    new (16827, new int[]{ 9 }), // Nightslayer Belt
                    new (16825, new int[]{ 9 }), // Nightslayer Bracelets
                    // Mail
                    new (16838, new int[]{ 9 }), // Earthfury Belt
                    new (16840, new int[]{ 9 }), // Earthfury Bracers
                    new (16851, new int[]{ 9 }), // Giantstalker's Belt
                    new (16850, new int[]{ 9 }), // Giantstalker's Bracers
                    // Plate
                    new (16864, new int[]{ 9 }), // Belt of Might
                    new (16861, new int[]{ 9 }), // Bracers of Might
                    new (16858, new int[]{ 9 }), // Lawbringer Belt
                    new (16857, new int[]{ 9 }), // Lawbringer Bracers
                }
            },
            {
                1000742, // Blackwing Lair > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (19437, new int[]{ 9 }), // Boots of Pure Thought
                    new (19438, new int[]{ 9 }), // Ringo's Blizzard Boots
                    // Leather
                    new (19439, new int[]{ 9 }), // Interlaced Shadow Jerkin
                    // Cloak
                    new (19436, new int[]{ 9 }), // Cloak of Draconic Might
                    // Weapon
                    new (19362, new int[]{ 9 }), // Doom's Edge
                    new (19354, new int[]{ 9 }), // Draconic Avenger
                    new (19358, new int[]{ 9 }), // Draconic Maul
                    new (19435, new int[]{ 9 }), // Essence Gatherer
                }
            },
            {
                1000744, // Temple of Ahn'Qiraj > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (21838, new int[]{ 9 }), // Garb of Royal Ascension
                    new (21888, new int[]{ 9 }), // Gloves of the Immortal
                    // Plate
                    new (21889, new int[]{ 9 }), // Gloves of the Redeemed Prophecy
                    // Weapon
                    new (21837, new int[]{ 9 }), // Anubisath Warhammer
                    new (21856, new int[]{ 9 }), // Neretzek, The Blood Drinker
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
                    new (95207, _raidDifficultiesAll), // Abandoned Zandalari Firecord
                    new (95208, _raidDifficultiesAll), // Abandoned Zandalari Shadowgirdle
                    new (95224, _raidDifficultiesAll), // Home-Warding Slippers
                    new (95223, _raidDifficultiesAll), // Silentflame Sandals
                    // Leather
                    new (95210, _raidDifficultiesAll), // Abandoned Zandalari Moonstrap
                    new (95209, _raidDifficultiesAll), // Abandoned Zandalari Silentbelt
                    new (95221, _raidDifficultiesAll), // Deeproot Treads
                    new (95219, _raidDifficultiesAll), // Spiderweb Tabi
                    // Mail
                    new (95211, _raidDifficultiesAll), // Abandoned Zandalari Arrowlinks
                    new (95212, _raidDifficultiesAll), // Abandoned Zandalari Waterchain
                    new (95220, _raidDifficultiesAll), // Scalehide Spurs
                    new (95222, _raidDifficultiesAll), // Spiritbound Boots
                    // Plate
                    new (95215, _raidDifficultiesAll), // Abandoned Zandalari Bucklebreaker
                    new (95214, _raidDifficultiesAll), // Abandoned Zandalari Goreplate
                    new (95213, _raidDifficultiesAll), // Abandoned Zandalari Greatbelt
                    new (95218, _raidDifficultiesAll), // Columnbreaker Stompers
                    new (95217, _raidDifficultiesAll), // Locksmasher Greaves
                    new (95216, _raidDifficultiesAll), // Vaultwalker Sabatons
                }
            },
            {
                1000369, // Siege of Orgrimmar > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new (113225, _raidDifficultiesAll), // Kalaena's Arcane Handwraps
                    new (113218, _raidDifficultiesAll), // Seebo's Sainted Touch
                    // Leather
                    new (113220, _raidDifficultiesAll), // Crimson Gauntlets of Death
                    new (113221, _raidDifficultiesAll), // Siid's Silent Stranglers
                    // Mail
                    new (113222, _raidDifficultiesAll), // Keengrip Arrowpullers
                    new (113227, _raidDifficultiesAll), // Marco's Crackling Gloves
                    // Plate
                    new (113228, _raidDifficultiesAll), // Gauntlets of Discarded Time
                    new (113219, _raidDifficultiesAll), // Romy's Reliable Grips
                    new (113229, _raidDifficultiesAll), // Zoid's Molten Gauntlets
                    // Cloak
                    new (113224, _raidDifficultiesAll), // Aeth's Swiftcinder Cloak
                    new (113231, _raidDifficultiesAll), // Brave Niunai's Cloak
                    new (113226, _raidDifficultiesAll), // Cape of the Alpha
                    new (113230, _raidDifficultiesAll), // Drape of the Omega
                    new (113223, _raidDifficultiesAll), // Turtleshell Greatcloak
                }
            },
            #endregion
            
            #region Warlords of Draenor Trash
            {
                1000477, // Highmaul > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(119336, _raidDifficultiesNoLfr), // Cord of Winsome Sorrows
                    // Leather
                    new(119335, _raidDifficultiesNoLfr), // Eyeripper Girdle
                    // Mail
                    new(119338, _raidDifficultiesNoLfr), // Belt of Inebriated Sorrows
                    // Plate
                    new(119337, _raidDifficultiesNoLfr), // Ripswallow Plate Belt
                    // Cloak
                    new(119343, _raidDifficultiesNoLfr), // Eye-Blinder Greatcloak
                    new(119347, _raidDifficultiesNoLfr), // Gill's Glorious Windcloak
                    new(119346, _raidDifficultiesNoLfr), // Kyu-Sy's Tarflame Doomcloak
                    new(119344, _raidDifficultiesNoLfr), // Magic-Breaker Cape
                    new(119345, _raidDifficultiesNoLfr), // Milenah's Intricate Cloak
                }
            },
            {
                1000457, // Blackrock Foundry > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(119332, _raidDifficultiesNoLfr), // Bracers of Darkened Skies
                    new(119342, _raidDifficultiesNoLfr), // Furnace Stoker's Footwraps
                    // Leather
                    new(119333, _raidDifficultiesNoLfr), // Bracers of Shattered Limbs
                    new(119340, _raidDifficultiesNoLfr), // Iron-Flecked Sandals
                    // Mail
                    new(119334, _raidDifficultiesNoLfr), // Bracers of Callous Disregard
                    new(119339, _raidDifficultiesNoLfr), // Treads of the Veteran Smith
                    // Plate
                    new(119331, _raidDifficultiesNoLfr), // Bracers of Visceral Force
                    new(119341, _raidDifficultiesNoLfr), // Doomslag Greatboots
                }
            },
            {
                1000669, // Hellfire Citadel > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(124182, _raidDifficultiesNoLfr), // Cord of Unhinged Malice
                    new(124150, _raidDifficultiesNoLfr), // Desiccated Soulrender Slippers
                    // Leather
                    new(124277, _raidDifficultiesNoLfr), // Flayed Demonskin Belt
                    new(124252, _raidDifficultiesNoLfr), // Jungle Assassin's Footpads
                    // Mail
                    new(124311, _raidDifficultiesNoLfr), // Cursed Demonchain Belt
                    new(124288, _raidDifficultiesNoLfr), // Unhallowed Voidlink Boots
                    // Plate
                    new(124323, _raidDifficultiesNoLfr), // Cruel Hope Crushers
                    new(124350, _raidDifficultiesNoLfr), // Girdle of Demonic Wrath
                }
            },
            #endregion
            
            #region Legion Trash
            {
                1000786, // The Nighthold > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(144404, _raidDifficultiesAll), // Mana-Cord of Deception
                    // Leather
                    new(144405, _raidDifficultiesAll), // Waistclasp of Unethical Power
                    // Mail
                    new(144406, _raidDifficultiesAll), // Vintage Duskwatch Cinch
                    // Plate
                    new(144407, _raidDifficultiesAll), // Gleaming Celestial Waistguard
                    // Cloak
                    new(144399, _raidDifficultiesAll), // Aristocrat's Winter Drape
                    new(144401, _raidDifficultiesAll), // Cloak of Multitudinous Sheaths
                    new(144403, _raidDifficultiesAll), // Fashionable Autumn Cloak
                    new(144400, _raidDifficultiesAll), // Feathermane Feather Cloak
                }
            },
            {
                1000875, // Tomb of Sargeras > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(147422, _raidDifficultiesAll), // Acolyte's Abandoned Footwraps
                    new(146989, _raidDifficultiesAll), // Fel-Flecked Grips
                    new(147423, _raidDifficultiesAll), // Sash of the Unredeemed
                    // Leather
                    new(147425, _raidDifficultiesAll), // Cord of Pilfered Rosaries
                    new(147424, _raidDifficultiesAll), // Treads of Violent Intrusion
                    new(147038, _raidDifficultiesAll), // Wakening Horror Spaulders
                    // Mail
                    new(147427, _raidDifficultiesAll), // Pristine Moon-Wrought Clasp
                    new(147044, _raidDifficultiesAll), // Soul-Rattle Ribcage
                    new(147426, _raidDifficultiesAll), // Treads of Panicked Escape
                    // Plate
                    new(147064, _raidDifficultiesAll), // Diadem of the Highborne
                    new(147429, _raidDifficultiesAll), // Girdle of the Crumbling Sanctum
                    new(147428, _raidDifficultiesAll), // Spiked Terrorwake Greatboots
                }
            },
            {
                1000946, // Antorus, the Burning Throne > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(153018, _raidDifficultiesAll), // Corrupted Mantle of the Felseekers
                    new(152085, _raidDifficultiesAll), // Cuffs of the Viridian Flameweavers
                    new(152084, _raidDifficultiesAll), // Gloves of Abhorrent Strategies
                    // Leather
                    new(152412, _raidDifficultiesAll), // Felflame Inferno Shoulderpads
                    new(151993, _raidDifficultiesAll), // Leggings of the Sable Stalkers
                    new(152087, _raidDifficultiesAll), // Sinuous Kerapteron Bindings
                    // Mail
                    new(152682, _raidDifficultiesAll), // Greaves of the Felblade Defenders
                    new(152088, _raidDifficultiesAll), // Horror Fiend-Scale Breastplate
                    new(152089, _raidDifficultiesAll), // Wristguards of Ominous Forging
                    // Plate
                    new(153019, _raidDifficultiesAll), // Hulking Demonlisher Legplates
                    new(152090, _raidDifficultiesAll), // Impenetrable Garothi Breastplate
                    new(152091, _raidDifficultiesAll), // Wristguards of the Dark Keepers
                }
            },
            #endregion
            
            #region Battle for Azeroth Trash
            {
                1001031, // Uldir > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(161071, _raidDifficultiesAll), // Bloody Experimenter's Wraps
                    new(160612, _raidDifficultiesAll), // Spellbound Specimen Handlers
                    // Leather
                    new(161075, _raidDifficultiesAll), // Antiseptic Specimen Handlers
                    new(161072, _raidDifficultiesAll), // Splatterguards
                    // Mail
                    new(161076, _raidDifficultiesAll), // Iron-Grip Specimen Handlers
                    new(161073, _raidDifficultiesAll), // Reinforced Test Subject Shackles
                    // Plate
                    new(161074, _raidDifficultiesAll), // Crushproof Vambraces
                    new(161077, _raidDifficultiesAll), // Fluid-Resistant Specimen Handlers
                }
            },
            {
                1001176, // Battle of Dazar'alor > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(165765, _raidDifficultiesAll), // Cord of Zandalari Resolve
                    new(165509, _raidDifficultiesAll), // Slippers of the Encroaching Tide
                    // Leather
                    new(165520, _raidDifficultiesAll), // Silent Pillager's Footpads
                    new(166518, _raidDifficultiesAll), // Warbeast Hide Cinch
                    // Mail
                    new(165547, _raidDifficultiesAll), // City Crusher Sabatons
                    new(165545, _raidDifficultiesAll), // Waistguard of Elemental Resistance
                    // Plate
                    new(165563, _raidDifficultiesAll), // Boots of the Dark Iron Raider
                    new(165564, _raidDifficultiesAll), // Last Stand Greatbelt
                    // Cloak
                    new(165925, _raidDifficultiesAll), // Drape of Valient Defense
                }
            },
            {
                1001179, // The Eternal Palace > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(169929, _raidDifficultiesAll), // Cuffs of Soothing Currents
                    new(169930, _raidDifficultiesAll), // Handwraps of Unhindered Resonance
                    // Leather
                    new(169932, _raidDifficultiesAll), // Brineweaver Guardian's Gloves
                    new(169931, _raidDifficultiesAll), // Skulker's Blackwater Bands
                    // Mail
                    new(169933, _raidDifficultiesAll), // Abyssal Bubbler's Bracers
                    new(169934, _raidDifficultiesAll), // Deepcrawler's Handguards
                    // Plate
                    new(169935, _raidDifficultiesAll), // Brutish Myrmidon's Vambraces
                    new(169936, _raidDifficultiesAll), // Gauntlets of Crashing Tides
                    // Cloak
                    new(168602, _raidDifficultiesAll), // Cloak of Blessed Depths
                }
            },
            {
                1001180, // Nya'lotha, the Waking City > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(175004, _raidDifficultiesAll), // Legwraps of Horrifying Figments
                    // Leather
                    new(175007, _raidDifficultiesAll), // Footpads of Terrible Delusions
                    // Mail
                    new(175005, _raidDifficultiesAll), // Belt of Concealed Intent
                    // Plate
                    new(175006, _raidDifficultiesAll), // Gauntlets of Nightmare Manifest
                    // Weapon
                    new(175010, _raidDifficultiesAll), // Maddened Adherent's Bulwark
                    new(175009, _raidDifficultiesAll), // Zealous Ritualist's Reverie
                }
            },
            #endregion
            
            #region Shadowlands Trash
            {
                1001190, // Castle Nathria > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(183017, _raidDifficultiesAll), // Acolyte's Velvet Bindings
                    new(183008, _raidDifficultiesAll), // Supple Supplicant's Gloves
                    // Leather
                    new(182978, _raidDifficultiesAll), // Barkweave Wristwraps
                    new(183010, _raidDifficultiesAll), // Stud-Scarred Footwear
                    // Mail
                    new(182990, _raidDifficultiesAll), // Legionnaire's Bloodstained Sabatons
                    new(182982, _raidDifficultiesAll), // Watchful Arbelist's Bracers
                    // Plate
                    new(183013, _raidDifficultiesAll), // Fallen Templar's Gauntlets
                    new(183031, _raidDifficultiesAll), // Soldier's Stoneband Wristguards
                    // Cloak
                    new(184778, _raidDifficultiesAll), // Decadent Nathrian Shawl
                }
            },
            {
                1001193, // Sanctum of Domination > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(186356, _raidDifficultiesAll), // Forlorn Prisoner's Strap
                    new(186358, _raidDifficultiesAll), // Soulcaster's Woven Grips
                    // Leather
                    new(186362, _raidDifficultiesAll), // Bindings of the Subjugated
                    new(186359, _raidDifficultiesAll), // Scoundrel's Harrowed Leggings
                    // Mail
                    new(186367, _raidDifficultiesAll), // Bonded Soulsmelt Greaves
                    new(196364, _raidDifficultiesAll), // Cord of Coerced Spirits
                    // Plate
                    new(186371, _raidDifficultiesAll), // Ancient Brokensoul Bands
                    new(186373, _raidDifficultiesAll), // Towering Shadowghast Greatboots
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
