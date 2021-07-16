using Newtonsoft.Json;
using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels
{
    public class UserViewModel
    {
        public readonly ApplicationUser User;
        public readonly ApplicationUserSettings Settings;
        public readonly string SettingsJson;
        public readonly string AchievementsHash;
        public readonly string StaticHash;

        public UserViewModel(ApplicationUser user, ApplicationUserSettings settings, string achievementsHash, string staticHash)
        {
            User = user;
            Settings = settings;
            SettingsJson = JsonConvert.SerializeObject(settings);
            AchievementsHash = achievementsHash;
            StaticHash = staticHash;
        }
    }
}
