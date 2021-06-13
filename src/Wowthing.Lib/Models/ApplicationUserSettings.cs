using System;
using System.Collections.Generic;
using System.Text;

#nullable enable
namespace Wowthing.Lib.Models
{
    public class ApplicationUserSettings
    {
        public ApplicationUserSettingsGeneral? General { get; set; } = new ApplicationUserSettingsGeneral();
        public ApplicationUserSettingsHome? Home { get; set; } = new ApplicationUserSettingsHome();
        public ApplicationUserSettingsPrivacy? Privacy { get; set; } = new ApplicationUserSettingsPrivacy();

        public ApplicationUserSettings()
        {
            Migrate();
        }

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
        }
    }

    public class ApplicationUserSettingsGeneral
    {
        public bool ShowClassIcon { get; set; } = false;
        public bool ShowItemLevel { get; set; } = true;
        public bool ShowRaceIcon { get; set; } = true;
        public bool ShowSpecIcon { get; set; } = true;
        public bool ShowRealm { get; set; } = true;
    }

    public class ApplicationUserSettingsHome
    {
        public bool ShowCovenant { get; set; } = true;
        public bool ShowKeystone { get; set; } = true;
        public bool ShowMountSkill { get; set; } = false;
        public bool ShowStatuses { get; set; } = true;
        public bool ShowVault { get; set; } = true;
        public bool ShowWeeklyAnima { get; set; } = true;
        public bool ShowWeeklySouls { get; set; } = false;
    }

    public class ApplicationUserSettingsPrivacy
    {
        public bool Anonymized { get; set; } = true;
        public bool Public { get; set; } = true;
        public bool ShowInLeaderboards { get; set; } = true;
    }
}
#nullable restore
