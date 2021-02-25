using System.Collections.Generic;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels
{
    public class UserViewModel
    {
        public readonly ApplicationUser User;
        public readonly string SettingsJson;
        public readonly string StaticHash;

        public UserViewModel(ApplicationUser user, string settingsJson, string staticHash)
        {
            User = user;
            SettingsJson = settingsJson;
            StaticHash = staticHash;
        }
    }
}
