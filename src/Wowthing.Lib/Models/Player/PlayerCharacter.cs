using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacter
    {
        [Key]
        public int Id { get; set; }

        // Blizzard character ID, may not actually need this
        public long CharacterId { get; set; }

        [ForeignKey("Account")]
        public int? AccountId { get; set; }
        public PlayerAccount Account { get; set; }

        // Available after UserCharacters pull
        public int ClassId { get; set; }
        public int Level { get; set; }
        public int RaceId { get; set; }
        public int RealmId { get; set; }
        public WowFaction Faction { get; set; }
        public WowGender Gender { get; set; }
        public string Name { get; set; }

        // Available later after Character pull
        public int ActiveSpecId { get; set; } = 0;
        public int ActiveTitleId { get; set; } = 0;
        public int AverageItemLevel { get; set; } = 0;
        public int EquippedItemLevel { get; set; } = 0;
        public int Experience { get; set; } = 0;
        public long GuildId { get; set; } = 0;

        // Bookkeeping
        public int DelayHours { get; set; } = 0;
        public DateTime LastApiCheck { get; set; } = DateTime.MinValue;

        // Navigation properties
        public List<PlayerCharacterEquippedItem> EquippedItems { get; set; }
        public PlayerCharacterMythicPlus MythicPlus { get; set; }
        public List<PlayerCharacterMythicPlusSeason> MythicPlusSeasons { get; set; }
        public PlayerCharacterQuests Quests { get; set; }
        public PlayerCharacterRaiderIo RaiderIo { get; set; }
        public PlayerCharacterReputations Reputations { get; set; }
        public PlayerCharacterShadowlands Shadowlands { get; set; }
    }
}
