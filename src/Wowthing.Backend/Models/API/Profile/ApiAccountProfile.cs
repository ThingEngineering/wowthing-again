using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Profile
{
    public class ApiAccountProfile
    {
        public long ID { get; set; }

        [JsonPropertyName("wow_accounts")]
        public List<Account> Accounts { get; set; }

        public class Account
        {
            public long ID { get; set; }

            public List<Character> Characters { get; set; }

            public class Character
            {
                public long ID { get; set; }
                public string Name { get; set; }
                public int Level { get; set; }
                public Realm Realm { get; set; }
                [JsonPropertyName("playable_class")]
                public PlayableClass Class { get; set; }
                [JsonPropertyName("playable_race")]
                public PlayableRace Race { get; set; }
                public ApiTypeName Gender { get; set; }
                public ApiTypeName Faction { get; set; }
            }

            public class Realm
            {
                public int ID { get; set; }
            }

            public class PlayableClass
            {
                public int ID { get; set; }
            }

            public class PlayableRace
            {
                public int ID { get; set; }
            }
        }
    }
}
