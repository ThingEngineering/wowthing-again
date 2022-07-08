using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data
{
    public class DumpFaction
    {
        public int ID { get; set; }
        public int FriendshipRepID { get; set; }
        
        [Name("Name_lang")]
        public string Name { get; set; }
    }
}
