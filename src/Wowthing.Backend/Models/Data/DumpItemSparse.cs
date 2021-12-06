using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data
{
    public class DumpItemSparse
    {
        public int ID { get; set; }

        public int AllowableClass { get; set; }
        public long AllowableRace { get; set; }
        public short ContainerSlots { get; set; }
        public short ExpansionID { get; set; }
        public short OverallQualityID { get; set; }
        public int Stackable { get; set; }

        [Name("Display_lang")]
        public string Name { get; set; }
    }
}
