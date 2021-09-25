using System;
using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

#nullable enable
namespace Wowthing.Lib.Models
{
    public class ApplicationUserSettings
    {
        public ApplicationUserSettingsCharacters Characters { get; set; } = new();
        public ApplicationUserSettingsGeneral? General { get; set; } = new();
        public ApplicationUserSettingsLayout? Layout { get; set; } = new();
        public ApplicationUserSettingsPrivacy? Privacy { get; set; } = new();
        public ApplicationUserSettingsTransmog? Transmog { get; set; } = new();
        
        public void Migrate()
        {
            if (Characters == null)
            {
                Characters = new();
            }
            if (General == null)
            {
                General = new();
            }
            if (Layout == null)
            {
                Layout = new();
            }
            if (Privacy == null)
            {
                Privacy = new();
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
            "covenant",
            "gold",
            "itemLevel",
            "keystone",
            "mountSpeed",
            "playedTime",
            "statusIcons",
            "torghast",
            "vaultMythicPlus",
            "vaultPvp",
            "vaultRaid",
            "weeklyAnima",
            "weeklyKorthia",
            "weeklySouls",
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
                .Where(field => _validHomeFields.Contains(field))
                .Distinct()
                .ToList();

            if (Layout.HomeFields.Count == 0)
            {
                Layout.HomeFields.Add("gold");
            }
        }
    }

    public class ApplicationUserSettingsCharacters
    {
        public List<int> HiddenCharacters { get; set; } = new();
    }
    
    public class ApplicationUserSettingsGeneral
    {
        public int MinimumLevel { get; set; } = 1;
        public int RefreshInterval { get; set; } = 0;
        public bool UseWowdb { get; set; } = false;

        public List<string> GroupBy { get; set; } = new();
        public List<string> SortBy { get; set; } = new();
    }

    public class ApplicationUserSettingsLayout
    {
        public List<string> CommonFields { get; set; } = new();
        public List<string> HomeFields { get; set; } = new();
    }

    public class ApplicationUserSettingsPrivacy
    {
        public bool Anonymized { get; set; } = true;
        public bool Public { get; set; } = true;
        public bool PublicCurrencies { get; set; } = true;
        public bool PublicLockouts { get; set; } = true;
        public bool PublicMythicPlus { get; set; } = true;
        public bool PublicTransmog { get; set; } = true;
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
