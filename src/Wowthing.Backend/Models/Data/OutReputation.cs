using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data
{
    [JsonConverter(typeof(OutReputationConverter))]
    public class OutReputation
    {
        public int Id { get; set; }
        public int TierId { get; set; }
        public string Name { get; set; }

        public OutReputation(DumpFaction faction)
        {
            Id = faction.ID;
            TierId = faction.FriendshipRepID;
            Name = faction.Name;
        }
    }
}
