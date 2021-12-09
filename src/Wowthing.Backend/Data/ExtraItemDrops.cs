using System.Collections.Generic;
using Wowthing.Backend.Models.Data.Journal;

namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        //869
        public static readonly Dictionary<int, List<ExtraItemDrop>> ExtraItemDrops = new()
        {
            {
                869, // Siege of Orgrimmar > Garrosh Hellscream
                new List<ExtraItemDrop>
                {
                    new()
                    {
                        ItemId = 112935, // Tusks of Mannoroth
                        Difficulties = new List<int> { 16 }, // Mythic Raid
                    },
                }
            },
            {
                1897, // Tomb of Sargeras > Maiden of Vigilance
                new List<ExtraItemDrop>
                {
                    new()
                    {
                        ItemId = 151524, // Hammer of Vigilance
                        Difficulties = new List<int> { 17, 14, 15, 16 }, // LFR/Normal/Heroic/Mythic Raid 
                    }
                }
            },
            {
                1984, // Antorus, the Burning Throne > Aggramar
                new List<ExtraItemDrop>
                {
                    new()
                    {
                        ItemId = 152094, // Taeshalach
                        Difficulties = new List<int> { 17, 14, 15, 16 }, // LFR/Normal/Heroic/Mythic Raid 
                    },
                }
            },
            {
                2031, // Antorus, the Burning Throne > Argus the Unmaker
                new List<ExtraItemDrop>
                {
                    new()
                    {
                        ItemId = 153115, // Scythe of the Unmaker (blue)
                        Difficulties = new List<int> { 17, 14, 15, 16 }, // LFR/Normal/Heroic/Mythic Raid 
                    },
                    new()
                    {
                        ItemId = 155880, // Scythe of the Unmaker (red)
                        Difficulties = new List<int> { 16 }, // Mythic Raid 
                    },
                }
            },
            {
                2168, // Uldir > Taloc
                new List<ExtraItemDrop>
                {
                    new()
                    {
                        ItemId = 163119, // Khor, Hammer of the Guardian
                        Difficulties = new List<int> { 17, 14, 15, 16 }, // LFR/Normal/Heroic/Mythic Raid 
                    },
                }
            },
            {
                2349, // The Eternal Palace > Za'qul
                new List<ExtraItemDrop>
                {
                    new()
                    {
                        ItemId = 168868, // Pauldrons of Za'qul
                        Difficulties = new List<int> { 17, 14, 15, 16 }, // LFR/Normal/Heroic/Mythic Raid 
                    },
                }
            },
        };
    }

    public class ExtraItemDrop
    {
        public int ItemId { get; set; }
        public List<int> Difficulties { get; set; }
    }
}
