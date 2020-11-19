using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class ApplicationUserSettings
    {
        public ApplicationUserSettingsPrivacy Privacy { get; set; }

        public ApplicationUserSettings()
        {
            Migrate();
        }

        public void Migrate()
        {
            if (Privacy == null)
            {
                Privacy = new ApplicationUserSettingsPrivacy();
            }
        }
    }

    public class ApplicationUserSettingsPrivacy
    {
        public bool Public { get; set; } = true;
        public bool Anonymized { get; set; } = true;
        public bool ShowInLeaderboards { get; set; } = true;
    }
}
