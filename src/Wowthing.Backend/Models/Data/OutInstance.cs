using System.Collections.Generic;
using System.Linq;

namespace Wowthing.Backend.Models.Data
{
    public class OutInstance
    {
        public int Expansion { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }

        public string ShortName
        {
            get
            {
                // lookup thing
                string shortName = _shortNameOverride.GetValueOrDefault(Name) ?? string.Join("", Name.Split().Where(w => w.ToLowerInvariant() != "the").Select(w => w[0]));
                return shortName;
            }
        }

        public OutInstance(DumpMap map, int instanceId)
        {
            Expansion = map.ExpansionID;
            Id = instanceId;
            Name = map.Name;
        }

        private static Dictionary<string, string> _shortNameOverride = new()
        {
            { "Atal'Dazar", "AD" },
            { "Plaguefall", "PF" },
            { "The Underrot", "UR" },
            { "Uldir", "Uld" },
        };
    }
}
