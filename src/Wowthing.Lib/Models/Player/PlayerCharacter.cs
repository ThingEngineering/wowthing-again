using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacter
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long Id { get; set; }

        public int? AccountId { get; set; }

        public long GuildId { get; set; }

        public int ActiveTitleId { get; set; } = 0;
        public int AverageItemLevel { get; set; } = 0;
        public int ClassId { get; set; }
        public int EquippedItemLevel { get; set; } = 0;
        public int Experience { get; set; } = 0;
        public int Level { get; set; }
        public int RaceId { get; set; }
        public int RealmId { get; set; }
        public WowFaction Faction { get; set; }
        public WowGender Gender { get; set; }

        public string Name { get; set; }

        public List<int> ReputationIds { get; set; }
        public List<int> ReputationValues { get; set; }

        public int DelayHours { get; set; } = 0;
        public DateTime LastApiCheck { get; set; } = DateTime.MinValue;

        [ForeignKey("AccountId")]
        public PlayerAccount Account { get; set; }

        public PlayerCharacterShadowlands Shadowlands { get; set; }
    }
}
