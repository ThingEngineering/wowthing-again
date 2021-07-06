using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpFaction
    {
        public int Id { get; set; }
        public int FriendshipRepId { get; set; }
        
        [Name("Name_lang")]
        public string Name { get; set; }
    }
}
