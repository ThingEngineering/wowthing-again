using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

#nullable enable
namespace Wowthing.Lib.Models
{
    public class ApplicationUserSettings
    {
        public ApplicationUserSettingsGeneral? General { get; set; } = new ApplicationUserSettingsGeneral();
        public ApplicationUserSettingsHome? Home { get; set; } = new ApplicationUserSettingsHome();
        public ApplicationUserSettingsPrivacy? Privacy { get; set; } = new ApplicationUserSettingsPrivacy();

        public void Migrate()
        {
            if (General == null)
            {
                General = new ApplicationUserSettingsGeneral();
            }
            
            if (Home == null)
            {
                Home = new ApplicationUserSettingsHome();
            }
            
            if (Privacy == null)
            {
                Privacy = new ApplicationUserSettingsPrivacy();
            }

            Validate();
        }

        private readonly HashSet<string> _validGroupBy = new()
        {
            "account",
            "enabled",
            "faction",
            "maxLevel",
        };
        private readonly HashSet<string> _validSortBy = new()
        {
            "account",
            "enabled",
            "faction", "-faction",
            "level",
            "name",
        };
        public void Validate()
        {
            General.GroupBy = General.GroupBy
                .EmptyIfNull()
                .Where(gb => _validGroupBy.Contains(gb))
                .Distinct()
                .ToList();
            
            if (General.GroupBy.Count == 0)
            {
                General.GroupBy.Add("faction");
            }

            General.SortBy = General.SortBy
                .EmptyIfNull()
                .Where(sb => _validSortBy.Contains(sb))
                .Distinct()
                .ToList();
            
            if (General.SortBy.Count == 0)
            {
                General.SortBy.Add("level");
                General.SortBy.Add("name");
            }
        }
    }

    public class ApplicationUserSettingsGeneral
    {
        public int MinimumLevel { get; set; } = 1;
        public bool ShowClassIcon { get; set; } = true;
        public bool ShowItemLevel { get; set; } = true;
        public bool ShowRaceIcon { get; set; } = true;
        public bool ShowSpecIcon { get; set; } = true;
        public bool ShowRealm { get; set; } = true;
        public bool UseWowdb { get; set; } = false;

        public List<string> GroupBy { get; set; } = new();
        public List<string> SortBy { get; set; } = new();
    }

    public class ApplicationUserSettingsHome
    {
        public bool ShowCovenant { get; set; } = true;
        public bool ShowKeystone { get; set; } = true;
        public bool ShowMountSpeed { get; set; } = true;
        public bool ShowStatuses { get; set; } = true;
        public bool ShowTorghast { get; set; } = true;
        public bool ShowVaultMythicPlus { get; set; } = true;
        public bool ShowVaultPvp { get; set; } = true;
        public bool ShowVaultRaid { get; set; } = true;
        public bool ShowWeeklyAnima { get; set; } = true;
        public bool ShowWeeklyShapingFate { get; set; } = true;
        public bool ShowWeeklySouls { get; set; } = true;
    }

    public class ApplicationUserSettingsPrivacy
    {
        public bool Anonymized { get; set; } = true;
        public bool Public { get; set; } = true;
        public bool ShowInLeaderboards { get; set; } = true;
    }
}
#nullable restore
