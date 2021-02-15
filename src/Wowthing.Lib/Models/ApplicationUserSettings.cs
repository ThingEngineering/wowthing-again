using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class ApplicationUserSettings
    {
        public ApplicationUserSettingsGeneral General { get; set; }
        public ApplicationUserSettingsPrivacy Privacy { get; set; }

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
            if (Privacy == null)
            {
                Privacy = new ApplicationUserSettingsPrivacy();
            }
        }
    }

    public class ApplicationUserSettingsGeneral
    {
        public bool ShowRealm { get; set; } = true;
    }

    public class ApplicationUserSettingsPrivacy
    {
        public bool Public { get; set; } = true;
        public bool Anonymized { get; set; } = true;
        public bool ShowInLeaderboards { get; set; } = true;
    }
}
