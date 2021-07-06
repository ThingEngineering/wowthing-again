using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpMap
    {
        public int Id { get; set; }

        public int ExpansionId { get; set; }
        public int InstanceType { get; set; }
        public int MaxPlayers { get; set; }

        [Name("MapName_lang")]
        public string Name { get; set; }
    }
}
