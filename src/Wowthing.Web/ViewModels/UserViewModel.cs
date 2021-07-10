using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels
{
    public class UserViewModel
    {
        public readonly ApplicationUser User;
        public readonly string SettingsJson;
        public readonly string AchievementsHash;
        public readonly string StaticHash;

        public UserViewModel(ApplicationUser user, string settingsJson, string achievementsHash, string staticHash)
        {
            User = user;
            SettingsJson = settingsJson;
            AchievementsHash = achievementsHash;
            StaticHash = staticHash;
        }
    }
}
