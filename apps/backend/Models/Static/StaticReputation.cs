using Wowthing.Backend.Converters.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static
{
    [JsonConverter(typeof(StaticReputationConverter))]
    public class StaticReputation : WowReputation
    {
        public string Description { get; set; }
        public string Name { get; set; }

        public StaticReputation(WowReputation reputation)
        {
            Id = reputation.Id;
            Expansion = reputation.Expansion;
            ParagonId = reputation.ParagonId;
            ParentId = reputation.ParagonId;
            TierId = reputation.TierId;
        }
    }
}
