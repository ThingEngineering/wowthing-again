using System;
using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

#nullable enable
namespace Wowthing.Lib.Models
{
    public class ApplicationUserSettings
    {
        public ApplicationUserSettingsGeneral? General { get; set; } = new();
        public ApplicationUserSettingsHome? Home { get; set; } = new();
        public ApplicationUserSettingsPrivacy? Privacy { get; set; } = new();
        public ApplicationUserSettingsTransmog? Transmog { get; set; } = new();
        
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
            "maxlevel",
        };
        private readonly HashSet<string> _validSortBy = new()
        {
            "account",
            "enabled",
            "faction", "-faction",
            "itemlevel",
            "level",
            "name",
        };
        public void Validate()
        {
            if (General.RefreshInterval <= 0)
            {
                General.RefreshInterval = 0;
            }
            else
            {
                // Clamp between 10 and 1440 minutes
                General.RefreshInterval = Math.Max(10, Math.Min(1440, General.RefreshInterval));
            }
            
            General.GroupBy = General.GroupBy
                .EmptyIfNull()
                .Select(gb => gb.ToLower())
                .Where(gb => _validGroupBy.Contains(gb))
                .Distinct()
                .ToList();
            
            if (General.GroupBy.Count == 0)
            {
                General.GroupBy.Add("faction");
            }

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
        }
    }

    public class ApplicationUserSettingsGeneral
    {
        public int MinimumLevel { get; set; } = 1;
        public int RefreshInterval { get; set; } = 0;
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

    public class ApplicationUserSettingsTransmog
    {
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
}
#nullable restore
