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
        public readonly string TransmogHash;

        public UserViewModel(ApplicationUser user, ApplicationUserSettings settings, string achievementsHash, string staticHash, string transmogHash)
        {
            User = user;
            Settings = settings;
            AchievementsHash = achievementsHash;
            StaticHash = staticHash;
            TransmogHash = transmogHash;

            Settings.Validate();
            SettingsJson = JsonConvert.SerializeObject(settings);
        }
    }
}
