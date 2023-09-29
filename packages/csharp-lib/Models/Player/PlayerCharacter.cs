using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

[Index(nameof(LastApiCheck))]
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

    // From addon data
    public bool IsResting { get; set; } = false;
    public bool IsWarMode { get; set; } = false;
    public int ChromieTime { get; set; } = 0;
    public int PlayedTotal { get; set; } = 0;
    public int RestedExperience { get; set; } = 0;
    public long Copper { get; set; } = 0;

    [ForeignKey("Guild")]
    public int? GuildId { get; set; }
    public PlayerGuild Guild { get; set; }

    // Bookkeeping
    public bool ShouldUpdate { get; set; } = true;
    public DateTime LastApiCheck { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime LastApiModified { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime LastSeenAddon { get; set; } = MiscConstants.DefaultDateTime;

    // Navigation properties
    public PlayerCharacterAchievements Achievements { get; set; }
    public PlayerCharacterAddonData AddonData { get; set; }
    public PlayerCharacterConfiguration Configuration { get; set; }
    public PlayerCharacterEquippedItems EquippedItems { get; set; }
    public PlayerCharacterLockouts Lockouts { get; set; }
    public PlayerCharacterMedia Media { get; set; }
    public PlayerCharacterMounts Mounts { get; set; }
    public PlayerCharacterMythicPlus MythicPlus { get; set; }
    public PlayerCharacterMythicPlusAddon MythicPlusAddon { get; set; }
    public PlayerCharacterProfessions Professions { get; set; }
    public PlayerCharacterQuests Quests { get; set; }
    public PlayerCharacterRaiderIo RaiderIo { get; set; }
    public PlayerCharacterReputations Reputations { get; set; }
    public PlayerCharacterShadowlands Shadowlands { get; set; }
    public PlayerCharacterSpecializations Specializations { get; set; }
    public PlayerCharacterStats Stats { get; set; }
    public PlayerCharacterTransmog Transmog { get; set; }
    public PlayerCharacterWeekly Weekly { get; set; }

    public PlayerCharacterAddonAchievements AddonAchievements { get; set; }
    public PlayerCharacterAddonMounts AddonMounts { get; set; }
    public PlayerCharacterAddonQuests AddonQuests { get; set; }
    public List<PlayerCharacterItem> Items { get; set; }
    public List<PlayerCharacterMythicPlusSeason> MythicPlusSeasons { get; set; }
}
