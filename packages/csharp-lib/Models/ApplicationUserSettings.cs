

#nullable enable
using System.Diagnostics;
using System.Text.RegularExpressions;
using Wowthing.Lib.Enums;
namespace Wowthing.Lib.Models;

public class ApplicationUserSettings
{
    public ApplicationUserSettingsAchievements? Achievements { get; set; } = new();
    public ApplicationUserSettingsAuctions? Auctions { get; set; } = new();
    public ApplicationUserSettingsCharacters? Characters { get; set; } = new();
    public ApplicationUserSettingsCollections Collections { get; set; } = new();
    public ApplicationUserSettingsGeneral? General { get; set; } = new();
    public ApplicationUserSettingsHistory? History { get; set; } = new();
    public ApplicationUserSettingsLayout? Layout { get; set; } = new();
    public ApplicationUserSettingsPrivacy? Privacy { get; set; } = new();
    public ApplicationUserSettingsTransmog? Transmog { get; set; } = new();

    public void Migrate()
    {
        Achievements ??= new ApplicationUserSettingsAchievements();
        Auctions ??= new ApplicationUserSettingsAuctions();
        Characters ??= new ApplicationUserSettingsCharacters();
        Collections ??= new ApplicationUserSettingsCollections();
        General ??= new ApplicationUserSettingsGeneral();
        History ??= new ApplicationUserSettingsHistory();
        Layout ??= new ApplicationUserSettingsLayout();
        Privacy ??= new ApplicationUserSettingsPrivacy();
        Transmog ??= new ApplicationUserSettingsTransmog();

        Validate();
    }

    private readonly Regex FixDesiredAccountNameRegex = new Regex(@"[ #""]", RegexOptions.Compiled);

    private readonly HashSet<string> _validGroupBy = new()
    {
        "account",
        "enabled",
        "faction",
        "maxlevel",
        "pinned",
        "realm",
    };
    private readonly HashSet<string> _validSortBy = new()
    {
        "account",
        "armor",
        "class",
        "enabled",
        "faction",
        "-faction",
        "gold",
        "itemlevel",
        "level",
        "mplusrating",
        "name",
        "realm",
    };

    private readonly HashSet<string> _validCovenantColumn = new()
    {
        "current",
        "all",
    };
    private readonly HashSet<string> _validPadding = new()
    {
        "small",
        "medium",
        "large",
    };
    private readonly HashSet<string> _validCommonFields = new()
    {
        "accountTag",
        "characterIconClass",
        "characterIconRace",
        "characterIconSpec",
        "characterLevel",
        "characterName",
        "realmName",
    };
    private readonly HashSet<string> _validHomeFields = new()
    {
        "callings",
        "covenant",
        "currentLocation",
        "emissariesBfa",
        "emissariesLegion",
        "gear",
        "gold",
        "hearthLocation",
        "itemLevel",
        "keystone",
        "lockouts",
        "mountSpeed",
        "mythicPlusScore",
        "playedTime",
        "professions",
        "professionsSecondary",
        "restedExperience",
        "statusIcons",
        "tasks",
        "vaultMythicPlus",
        "vaultPvp",
        "vaultRaid",
    };

    private readonly HashSet<string> _validHomeTasks = new()
    {
        "somethingDifferent",

        "dmfProfessions",

        "holidayArenaSkirmishes",
        "holidayBattlegrounds",
        "holidayDungeons",
        "holidayPetBattles",
        "holidayTimewalking",
        "holidayWorldQuests",

        "legionWitheredTraining",

        "slAnima",
        "slFatedWorldQuest",
        "slKorthia",
        "slMawAssault",
        "slNewDeal",
        "slTormentors",
        "slZerethMortis",
    };

    private void Validate()
    {
        Debug.Assert(General != null);
        Debug.Assert(Layout != null);

        // General
        // Clamp between 0 and 1440 minutes
        General.RefreshInterval = Math.Max(0, Math.Min(1440, General.RefreshInterval));

        General.DesiredAccountName = FixDesiredAccountNameRegex
            .Replace(General.DesiredAccountName.EmptyIfNullOrWhitespace(), "")
            .Truncate(32);

        General.GroupBy = General.GroupBy
            .EmptyIfNull()
            .Select(gb => gb.ToLower())
            .Where(gb => _validGroupBy.Contains(gb))
            .Distinct()
            .ToList();

        General.SortBy = General.SortBy
            .EmptyIfNull()
            .Select(sb => sb.ToLower())
            .Where(sb => _validSortBy.Contains(sb))
            .Distinct()
            .ToList();

        if (General.SortBy.Count == 0)
        {
            General.SortBy.Add("level");
            General.SortBy.Add("name");
        }

        // Layout
        if (!_validCovenantColumn.Contains(Layout.CovenantColumn))
        {
            Layout.CovenantColumn = "current";
        }
        if (!_validPadding.Contains(Layout.Padding))
        {
            Layout.Padding = "medium";
        }

        Layout.CommonFields = Layout.CommonFields
            .EmptyIfNull()
            .Where(field => _validCommonFields.Contains(field))
            .Distinct()
            .ToList();

        if (Layout.CommonFields.Count == 0)
        {
            Layout.CommonFields.Add("characterIconRace");
            Layout.CommonFields.Add("characterIconClass");
            Layout.CommonFields.Add("characterIconSpec");
            Layout.CommonFields.Add("characterName");
            Layout.CommonFields.Add("realmName");
        }

        Layout.HomeFields = Layout.HomeFields
            .EmptyIfNull()
            .Select(field => field == "weeklies" ? "tasks" : field)
            .Where(field => _validHomeFields.Contains(field))
            .Distinct()
            .ToList();

        if (Layout.HomeFields.Count == 0)
        {
            Layout.HomeFields.Add("gold");
            Layout.HomeFields.Add("itemLevel");
            Layout.HomeFields.Add("covenant");
        }

        if (Layout.HomeTasks?.Count == 0)
        {
            Layout.HomeTasks = Layout.HomeWeeklies;
        }

        Layout.HomeTasks = Layout.HomeTasks
            .EmptyIfNull()
            .Where(field => _validHomeTasks.Contains(field))
            .Distinct()
            .ToList();
    }
}

public class ApplicationUserSettingsAchievements
{
    public bool ShowCharactersIfCompleted { get; set; } = false;
}

public class ApplicationUserSettingsAuctions
{
    public List<int> IgnoredRealms { get; set; } = new();
    public int MinimumExtraPetsValue { get; set; } = 0;

    public List<ApplicationUserSettingsAuctionCategory> CustomCategories { get; set; } = new();
}

public class ApplicationUserSettingsAuctionCategory
{
    public string Name { get; set; }
    public List<int> ItemIds { get; set; }
}

public class ApplicationUserSettingsCharacters
{
    public bool HideDisabledAccounts { get; set; } = false;
    public List<int> HiddenCharacters { get; set; } = new();
    public List<int> PinnedCharacters { get; set; } = new();
}

public class ApplicationUserSettingsCollections
{
    public bool HideUnavailable { get; set; } = false;
}

public class ApplicationUserSettingsGeneral
{
    public string? DesiredAccountName { get; set; }
    public Language Language { get; set; } = Language.enUS;
    public int RefreshInterval { get; set; }
    public bool UseWowdb { get; set; } = false;

    public List<string> GroupBy { get; set; } = new();
    public List<string> SortBy { get; set; } = new();
}

public class ApplicationUserSettingsHistory
{
    public List<int> HiddenRealms { get; set; } = new();
}

public class ApplicationUserSettingsLayout
{
    public string CovenantColumn { get; set; } = "current";
    public bool IncludeArchaeology { get; set; } = false;
    public string Padding { get; set; } = "medium";
    public bool ShowEmptyLockouts { get; set; } = false;
    public List<string> CommonFields { get; set; } = new();
    public List<string> HomeFields { get; set; } = new();
    public List<int> HomeLockouts { get; set; } = new();
    public List<string> HomeTasks { get; set; } = new();
    public List<string> HomeWeeklies { get; set; } = new();
}

public class ApplicationUserSettingsPrivacy
{
    public bool Anonymized { get; set; } = true;
    public bool Public { get; set; } = true;
    public bool PublicAccounts { get; set; } = false;
    public bool PublicCurrencies { get; set; } = true;
    public bool PublicLockouts { get; set; } = true;
    public bool PublicMythicPlus { get; set; } = true;
    public bool PublicQuests { get; set; } = true;
    public bool PublicTransmog { get; set; } = true;
    public bool ShowInLeaderboards { get; set; } = true;
}

public class ApplicationUserSettingsTransmog
{
    public bool CompletionistMode { get; set; } = false;

    public bool ShowAllianceOnly { get; set; } = true;
    public bool ShowHordeOnly { get; set; } = true;

    public bool ShowDeathKnight { get; set; } = true;
    public bool ShowDemonHunter { get; set; } = true;
    public bool ShowDruid { get; set; } = true;
    public bool ShowHunter { get; set; } = true;
    public bool ShowMage { get; set; } = true;
    public bool ShowMonk { get; set; } = true;
    public bool ShowPaladin { get; set; } = true;
    public bool ShowPriest { get; set; } = true;
    public bool ShowRogue { get; set; } = true;
    public bool ShowShaman { get; set; } = true;
    public bool ShowWarlock { get; set; } = true;
    public bool ShowWarrior { get; set; } = true;
}
#nullable restore
