using CsvHelper.Configuration.Attributes;
using Wowthing.Backend.Enums;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Items
{
    public class DumpItemSparse
    {
        public int ID { get; set; }

        public int AllowableClass { get; set; }
        public long AllowableRace { get; set; }
        public short ContainerSlots { get; set; }
        public short ExpansionID { get; set; }
        public int ItemLevel { get; set; }
        public int ItemNameDescriptionID { get; set; }
        public short OverallQualityID { get; set; }
        public int Stackable { get; set; }

        [Name("Flags[3]")]
        public WowItemFlags4 Flags4 { get; set; }
        
        [Name("StatModifier_bonusStat[0]")]
        public int StatType0 { get; set; }
        [Name("StatModifier_bonusStat[1]")]
        public int StatType1 { get; set; }
        [Name("StatModifier_bonusStat[2]")]
        public int StatType2 { get; set; }
        [Name("StatModifier_bonusStat[3]")]
        public int StatType3 { get; set; }
        [Name("StatModifier_bonusStat[4]")]
        public int StatType4 { get; set; }
        [Name("StatModifier_bonusStat[5]")]
        public int StatType5 { get; set; }
        [Name("StatModifier_bonusStat[6]")]
        public int StatType6 { get; set; }
        [Name("StatModifier_bonusStat[7]")]
        public int StatType7 { get; set; }
        [Name("StatModifier_bonusStat[8]")]
        public int StatType8 { get; set; }
        [Name("StatModifier_bonusStat[9]")]
        public int StatType9 { get; set; }
        
        [Name("Display_lang")]
        public string Name { get; set; }

        public int[] Stats => new[]
        {
            StatType0,
            StatType1,
            StatType2,
            StatType3,
            StatType4,
            StatType5,
            StatType6,
            StatType7,
            StatType8,
            StatType9,
        };
    }
}
