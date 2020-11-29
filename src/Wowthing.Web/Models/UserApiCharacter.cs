using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Models
{
    public class UserApiCharacter
    {
        public int ClassId { get; set; }
        public int Level { get; set; }
        public int RaceId { get; set; }
        public int RealmId { get; set; }
        public string Name { get; set; }
        public WowFaction Faction { get; set; }
        public WowGender Gender { get; set; }
        public Dictionary<int, int> Reputations { get; set; } = new Dictionary<int, int>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public UserApiCharacterShadowlands Shadowlands { get; set; }

        public UserApiCharacter(PlayerCharacter character, bool pub = false, bool anon = false)
        {
            ClassId = character.ClassId;
            Faction = character.Faction;
            Gender = character.Gender;
            Level = character.Level;
            RaceId = character.RaceId;

            if (pub && anon)
            {
                Name = "SecretGoose008";
            }
            else
            {
                Name = character.Name;
                RealmId = character.RealmId;
            }

            if (character.ReputationIds != null && character.ReputationValues != null)
            {
                Reputations = character.ReputationIds.Zip(character.ReputationValues)
                    .ToDictionary(k => k.First, v => v.Second);
            }

            if (character.Shadowlands != null)
            {
                Shadowlands = new UserApiCharacterShadowlands(character.Shadowlands);
            }
        }
    }

    public class UserApiCharacterShadowlands
    {
        public int CovenantId { get; }
        public int RenownLevel { get; }
        public int SoulbindId { get; }
        public List<int[]> Conduits { get; }

        public UserApiCharacterShadowlands(PlayerCharacterShadowlands shadowlands)
        {
            CovenantId = shadowlands.CovenantId;
            RenownLevel = shadowlands.RenownLevel;
            SoulbindId = shadowlands.SoulbindId;

            Conduits = shadowlands.ConduitIds.Zip(shadowlands.ConduitRanks)
                .Select(z => new int[] { z.First, z.Second }).ToList();
        }
    }
}
