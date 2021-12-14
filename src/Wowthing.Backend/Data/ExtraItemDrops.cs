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
                1000477, // Highmaul > Trash
                new List<ExtraItemDrop>
                {
                    // Cloth
                    new(119336, _raidDifficultiesNoLfr), // Cord of Winsome Sorrows
                    new(113610, _raidDifficultiesNoLfr), // Meatmonger's Gory Grips
                    // Leather
                    new(119335, _raidDifficultiesNoLfr), // Eyeripper Girdle
                    new(113602, _raidDifficultiesNoLfr), // Throat-Ripper Gauntlets
                    // Mail
                    new(119338, _raidDifficultiesNoLfr), // Belt of Inebriated Sorrows
                    new(113593, _raidDifficultiesNoLfr), // Grips of Vicious Mauling
                    // Plate
                    new(113632, _raidDifficultiesNoLfr), // Gauntlets of the Heavy Hand
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
