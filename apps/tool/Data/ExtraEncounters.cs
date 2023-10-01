using Wowthing.Tool.Models;

namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    public static readonly Dictionary<int, ExtraEncounter[]> ExtraEncounters = new()
    {
        #region Miscellaneous
        // ??? > Darkmaul Citadel
        {
            1,
            new[]
            {
                new ExtraEncounter("Tunk"),
                new ExtraEncounter("Gor'groth"),
            }
        },
        // ??? > Anniversary World Bosses
        {
            2,
            new[]
            {
                new ExtraEncounter("Azuregos"),
                new ExtraEncounter("Lord Kazzak"),
                new ExtraEncounter("Dragons of Nightmare"),
                new ExtraEncounter("Emeriss"),
                new ExtraEncounter("Lethon"),
                new ExtraEncounter("Taerar"),
                new ExtraEncounter("Ysondre"),
                new ExtraEncounter("Doomwalker"),
            }
        },
//        // ??? > Diablo 4 Launch Event - No longer active
//        {
//            3,
//            new[]
//            {
//                new ExtraEncounter("Treasure Goblin"),
//            }
//        },
        #endregion

        #region Classic
        // Classic > Shadowfang Keep
        {
            64,
            new[]
            {
                new ExtraEncounter("Fel Steed")
                {
                    AfterEncounter = 96, // Baron Ashbury
                },
                new ExtraEncounter("Deathsworn Captain")
                {
                    AfterEncounter = 98, // Commander Springvale
                },
            }
        },
        // Classic > Blackrock Depths
        {
            228,
            new[]
            {
//                new ExtraEncounter("Theldren") - (Mostly) unavailable
//                {
//                    AfterEncounter = 371, // Houndmaster Grebmar
//                },
                new ExtraEncounter("Verek")
                {
                    AfterEncounter = 375, // Warder Stilgiss
                },
                new ExtraEncounter("Watchman Doomgrip")
                {
                    AfterEncounter = 375, // Warder Stilgiss
                },
                new ExtraEncounter("Panzor the Invincible")
                {
                    AfterEncounter = 384, // Ambassador Flamelash
                },
            }
        },
        // Classic > Lower Blackrock Spire
        {
            229,
            new[]
            {
                new ExtraEncounter("Burning Felguard")
                new ExtraEncounter("Spirestone Battle Lord")
                new ExtraEncounter("Spirestone Butcher")
                new ExtraEncounter("Spirestone Magus")
//                new ExtraEncounter("Mor Grayhoof") - (Mostly) unavailable
//                {
//                    AfterEncounter = 390, // War Master Voone
//                },
                new ExtraEncounter("Bannok Grimaxe")
                {
                    AfterEncounter = 390, // War Master Voone
                },
                new ExtraEncounter("Crystal Fang")
                {
                    AfterEncounter = 390, // War Master Voone
                },
                new ExtraEncounter("Ghok Bashguud")
                {
                    AfterEncounter = 395, // Gizrul the Slavener
                },
            }
        },
        // Classic > Dire Maul
        {
            230,
            new[]
            {
//                new ExtraEncounter("Isalien") - (Mostly) unavailable
//                {
//                    AfterEncounter = 402, // Zevrim Thornhoof
//                },
                new ExtraEncounter("Tsu'zee")
                {
                    AfterEncounter = 408, // Magister Kalendris
                },
//                new ExtraEncounter("Lord Hel'nurath") - (Mostly) unavailable
//                {
//                    AfterEncounter = 409, // Immol'thar
//                },
                new ExtraEncounter("Gordok Tribute")
                {
                    AfterEncounter = 417, // King Gordok
                },
            }
        },
        // Classic > Gnomeregan
        {
            231,
            new[]
            {
                new ExtraEncounter("Dark Iron Ambassador")
                {
                    AfterEncounter = 418, // Crowd Pummeler 9-60
                },
                new ExtraEncounter("Endgineer Omegaplugg")
                {
                    AfterEncounter = 422, // Mekgineer Thermaplugg
                },
            }
        },
        // Classic > Maraudon
        {
            231,
            new[]
            {
                new ExtraEncounter("Meshlok the Harvester")
                {
                    AfterEncounter = 427, // Lord Vyletongue
                },
            }
        },
        // Classic > Razorfen Downs
        {
            232,
            new[]
            {
                new ExtraEncounter("Sah'rhee")
                {
                    AfterEncounter = 1142, // Aarux
                },
            }
        },
        // Classic > Razorfen Kraul
        {
            234,
            new[]
            {
                new ExtraEncounter("Kraulshaper Tukaar")
                new ExtraEncounter("Enormous Bullfrog")
                {
                    AfterEncounter = 900, // Groyat, the Blind Hunter
                },
            }
        },
        // Classic > Stratholme
        {
            236,
            new[]
            {
                new ExtraEncounter("Postmaster Malown")
                {
                    AfterEncounter = 443, // Hearthstinger Forresten
                },
                new ExtraEncounter("Skul")
                {
                    AfterEncounter = 443, // Hearthstinger Forresten
                },
//                new ExtraEncounter("Sothos and Jarien") - (Mostly) unavailable
//                {
//                    AfterEncounter = 449, // Balnazzar
//                },
                new ExtraEncounter("Stonespine")
                {
                    AfterEncounter = 450, // The Unforgiven
                },
             }
        },
        // Classic > Wailing Caverns
        {
            240,
            new[]
            {
                new ExtraEncounter("Druid of the Fang")
                new ExtraEncounter("Deviate Faerie Dragon")
                {
                    AfterEncounter = 478, // Skum
                },
            }
        },
        // Classic > Zul'Farrak
        {
            241,
            new[]
            {
                new ExtraEncounter("Sandarr Dunereaver")
                new ExtraEncounter("Zerillis")
                new ExtraEncounter("Dustwraith")
                {
                    AfterEncounter = 486, // Witch Doctor Zum'rah
                },
            }
        },
        // Classic > Ruins of Ahn'Qiraj
        {
            743,
            new[]
            {
                new ExtraEncounter("Captains")
                {
                    AfterEncounter = 1537, // Kurinnaxx
                },
            }
        },
        #endregion

        #region The Burning Crusade
        // TBC > Old Hillsbrad Foothills
        {
            251,
            new[]
            {
                new ExtraEncounter("Don Carlos"),
            }
        },
        // TBC > Karazhan
        {
            745,
            new[]
            {
                new ExtraEncounter("Nightbane")
                {
                    AfterEncounter = 1561, // Netherspite
                },
            }
        },
        #endregion

        #region Wrath of the Lich King
        // WotLK > The Culling of Stratholme
        {
            279,
            new[]
            {
                new ExtraEncounter("Infinite Corruptor")
                {
                    AfterEncounter = 613, // Chrono-Lord Epoch
                }
            }
        },
        // WotLK > Icecrown Citadel
        {
            758,
            new[]
            {
                new ExtraEncounter("Sanctified T10"),
            }
        },
        #endregion

        #region Mists of Pandaria
        // MoP > Scholomance
        {
            246,
            new[]
            {
                new ExtraEncounter("Doctor Theolen Krastinov")
                {
                    AfterEncounter = 665, // Rattlegore
                },
            }
        },
        // MoP > Throne of Thunder
        {
            362,
            new[]
            {
                new ExtraEncounter("Shared Boss Drops")
                {
                    // AfterEncounter = 1000362,
                },
            }
        },
        #endregion

        #region Legion
        // Legion > Return to Karazhan
        {
            860,
            new[]
            {
                new ExtraEncounter("Nightbane")
                {
                    AfterEncounter = 1836, // The Curator
                },
            }
        },
        // Legion > Seat of the Triumvirate
        {
            945,
            new[]
            {
                new ExtraEncounter("Vixx the Collector")
                {
                    AfterEncounter = 1979, // Zuraal the Ascended
                },
            }
        },
        #endregion Legion
    };
}
