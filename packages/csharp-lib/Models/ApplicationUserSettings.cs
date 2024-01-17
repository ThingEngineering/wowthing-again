#nullable enable
using System.Diagnostics;
using System.Text.RegularExpressions;
using Wowthing.Lib.Enums;
namespace Wowthing.Lib.Models;

public class ApplicationUserSettings
{
    private static readonly Regex FixDesiredAccountNameRegex = new Regex(@"[ #""]", RegexOptions.Compiled);
    private static readonly Regex ValidTaskString = new Regex(@"^\w{1,30}$", RegexOptions.Compiled);

    public string ActiveView { get; set; } = String.Empty;

    public ApplicationUserSettingsAchievements? Achievements { get; set; } = new();
    public ApplicationUserSettingsAuctions? Auctions { get; set; } = new();
    public ApplicationUserSettingsCharacters? Characters { get; set; } = new();
    public ApplicationUserSettingsCollections? Collections { get; set; } = new();
    public ApplicationUserSettingsGeneral? General { get; set; } = new();
    public ApplicationUserSettingsHistory? History { get; set; } = new();
    public ApplicationUserSettingsLayout? Layout { get; set; } = new();
    public ApplicationUserSettingsLeaderboard? Leaderboard { get; set; } = new();
    public ApplicationUserSettingsPrivacy? Privacy { get; set; } = new();
    public ApplicationUserSettingsProfessions? Professions { get; set; } = new();
    public ApplicationUserSettingsTasks? Tasks { get; set; } = new();
    public ApplicationUserSettingsTransmog? Transmog { get; set; } = new();

    public List<ApplicationUserSettingsCustomGroup>? CustomGroups { get; set; } = new();
    public List<ApplicationUserSettingsView>? Views { get; set; } = new();

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
        "-armor",
        "class",
        "enabled",
        "faction",
        "-faction",
        "gold",
        "guild",
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
        "currencies",
        "currentLocation",
        "emissariesBfa",
        "emissariesLegion",
        "gear",
        "gold",
        "guild",
        "hearthLocation",
        "itemLevel",
        "items",
        "keystone",
        "lockouts",
        "mountSpeed",
        "mythicPlusScore",
        "playedTime",
        "professionCooldowns",
        "professionWorkOrders",
        "professions",
        "professionsSecondary",
        "restedExperience",
        "statusIcons",
        "tasks",
        "vaultMythicPlus",
        "vaultPvp",
        "vaultRaid",
    };

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
        Professions ??= new ApplicationUserSettingsProfessions();
        Tasks ??= new ApplicationUserSettingsTasks();
        Transmog ??= new ApplicationUserSettingsTransmog();

        CustomGroups ??= new List<ApplicationUserSettingsCustomGroup>();
        Views ??= new List<ApplicationUserSettingsView>();

        if (Views.Count == 0)
        {
            Views.Add(new ApplicationUserSettingsView
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Default",
                GroupBy = General.GroupBy,
                SortBy = General.SortBy,
                CommonFields = Layout.CommonFields,
                HomeFields = Layout.HomeFields,
                HomeLockouts = Layout.HomeLockouts,
                HomeTasks = Layout.HomeTasks,
                DisabledChores = Tasks.DisabledChores,
            });
        }

        // Set active view to the first one if it's no longer valid
        if (string.IsNullOrEmpty(ActiveView) || Views.All(view => view.Id != ActiveView))
        {
            ActiveView = Views.First().Id;
        }

        Validate();
    }

    private void Validate()
    {
        Debug.Assert(General != null);
        Debug.Assert(Layout != null);
        Debug.Assert(Tasks != null);

        // General
        // Clamp between 0 and 1440 minutes
        General.RefreshInterval = Math.Max(0, Math.Min(1440, General.RefreshInterval));

        General.DesiredAccountName = FixDesiredAccountNameRegex
            .Replace(General.DesiredAccountName.EmptyIfNullOrWhitespace(), "")
            .Truncate(32);

        // Layout
        if (!_validCovenantColumn.Contains(Layout.CovenantColumn))
        {
            Layout.CovenantColumn = "current";
        }
        if (!_validPadding.Contains(Layout.Padding))
        {
            Layout.Padding = "medium";
        }

        // Views
        foreach (var view in Views.EmptyIfNull())
        {
            view.GroupBy = view.GroupBy
                .EmptyIfNull()
                .Select(gb => gb.ToLower())
                .Where(gb => _validGroupBy.Contains(gb))
                .Distinct()
                .ToList();

            view.SortBy = view.SortBy
                .EmptyIfNull()
                .Select(sb => sb.ToLower())
                .Where(sb => _validSortBy.Contains(sb))
                .Distinct()
                .ToList();

            if (view.SortBy.Count == 0)
            {
                view.SortBy.AddRange([
                    "level",
                    "name",
                ]);
            }

            view.CommonFields = view.CommonFields
                .EmptyIfNull()
                .Where(field => _validCommonFields.Contains(field))
                .Distinct()
                .ToList();

            if (view.CommonFields.Count == 0)
            {
                view.CommonFields.AddRange([
                    "characterIconRace",
                    "characterIconClass",
                    "characterIconSpec",
                    "characterName",
                    "realmName",
                ]);
            }

            view.HomeFields = view.HomeFields
                .EmptyIfNull()
                .Where(field => _validHomeFields.Contains(field))
                .Distinct()
                .ToList();

            if (view.HomeFields.Count == 0)
            {
                view.HomeFields.AddRange([
                    "gold",
                    "itemLevel",
                ]);
            }

            view.HomeTasks = view.HomeTasks
                .EmptyIfNull()
                .Where(field => ValidTaskString.IsMatch(field))
                .Distinct()
                .ToList();

            view.DisabledChores = view.DisabledChores
                .Where(kvp => ValidTaskString.IsMatch(kvp.Key))
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
        }
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
    public string Name { get; set; } = "Unnamed";
    public List<int> ItemIds { get; set; } = new();
}

public class ApplicationUserSettingsCharacters
{
    public short DefaultBackgroundId { get; set; } = 1;
    public short DefaultBackgroundBrightness { get; set; } = 10;
    public short DefaultBackgroundSaturation { get; set; } = 10;
    public bool HideDisabledAccounts { get; set; } = false;
    public Dictionary<int, int> Flags { get; set; } = new();
    public List<int> HiddenCharacters { get; set; } = new();
    public List<int> IgnoredCharacters { get; set; } = new();
    public List<int> PinnedCharacters { get; set; } = new();
    public List<string> NameTooltipDisplay { get; set; } = new();
}

public class ApplicationUserSettingsCollections
{
    public bool HideUnavailable { get; set; } = false;
}

public class ApplicationUserSettingsCustomGroup
{
    public string Filter { get; set; } = String.Empty;
    public string Id { get; set; } = String.Empty;
    public string Name { get; set; } = String.Empty;
}

public class ApplicationUserSettingsGeneral
{
    public string? DesiredAccountName { get; set; }
    public Language Language { get; set; } = Language.enUS;
    public int RefreshInterval { get; set; }
    public bool UseEnglishRealmNames { get; set; } = true;
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
    public bool IncludeArchaeology { get; set; } = false;
    public bool NewNavigation { get; set; } = false;
    public bool NewNavigationIcons { get; set; } = false;
    public bool ShowEmptyLockouts { get; set; } = false;
    public bool ShowPartialLevel { get; set; } = true;
    public bool UseClassColors { get; set; } = false;

    public bool NavigationAppearances { get; set; } = false;
    public bool NavigationCustomizations { get; set; } = false;
    public bool NavigationMounts { get; set; } = false;
    public bool NavigationPets { get; set; } = false;
    public bool NavigationToys { get; set; } = false;

    public string CovenantColumn { get; set; } = "current";
    public string Padding { get; set; } = "medium";
    public List<string> CommonFields { get; set; } = new();
    public List<string> HomeFields { get; set; } = new();
    public List<int> HomeLockouts { get; set; } = new();
    public List<string> HomeTasks { get; set; } = new();
}

public class ApplicationUserSettingsLeaderboard
{
    public bool Anonymous { get; set; } = false;
    public bool Enabled { get; set; } = true;
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
}

public class ApplicationUserSettingsProfessions
{
    public bool DragonflightCountCraftingDrops { get; set; } = true;
    public bool DragonflightCountGathering { get; set; } = true;
    public bool DragonflightCountTasks { get; set; } = true;
    public bool DragonflightTreatises { get; set; } = true;

    public Dictionary<string, bool> Cooldowns { get; set; } = new();
}

public class ApplicationUserSettingsTasks
{
    public Dictionary<string, List<string>> DisabledChores { get; set; } = new();
}

public class ApplicationUserSettingsTransmog
{
    public bool CompletionistMode { get; set; } = false;
    public bool CompletionistSets { get; set; } = false;

    public bool ShowAllianceOnly { get; set; } = true;
    public bool ShowHordeOnly { get; set; } = true;

    public bool ShowDeathKnight { get; set; } = true;
    public bool ShowDemonHunter { get; set; } = true;
    public bool ShowDruid { get; set; } = true;
    public bool ShowEvoker { get; set; } = true;
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

public class ApplicationUserSettingsView
{
    public string Id { get; set; }
    public string Name { get; set; }

    public string CharacterFilter { get; set; } = string.Empty;

    public List<string> GroupBy { get; set; } = new();
    public List<string> Groups { get; set; } = new();
    public List<string> SortBy { get; set; } = new();

    public List<string> CommonFields { get; set; } = new();
    public List<string> HomeFields { get; set; } = new();

    public List<int> HomeCurrencies { get; set; } = new();
    public List<int> HomeItems { get; set; } = new();
    public List<int> HomeLockouts { get; set; } = new();
    public List<string> HomeTasks { get; set; } = new();

    public Dictionary<string, List<string>> DisabledChores { get; set; } = new();
}
#nullable restore
