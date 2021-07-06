using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpMap
    {
        public int ID { get; set; }

        public int ExpansionID { get; set; }
        public int InstanceType { get; set; }
        public int MaxPlayers { get; set; }

        [Name("MapName_lang")]
        public string Name { get; set; }
    }
}
