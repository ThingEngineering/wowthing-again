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
        public int MinimumLevel { get; set; } = 1;
        public bool ShowClassIcon { get; set; } = true;
        public bool ShowItemLevel { get; set; } = true;
        public bool ShowRaceIcon { get; set; } = true;
        public bool ShowSpecIcon { get; set; } = true;
        public bool ShowRealm { get; set; } = true;
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
