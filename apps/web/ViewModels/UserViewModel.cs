using StackExchange.Redis;
using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels
{
    public class UserViewModel
    {
        public readonly ApplicationUser User;
        public readonly ApplicationUserSettings Settings;
        public readonly string SettingsJson;
        public readonly string AchievementHash;
        public readonly string JournalHash;
        public readonly string ManualHash;
        public readonly string StaticHash;

        public UserViewModel(IConnectionMultiplexer redis, ApplicationUser user)
        {
            User = user;
            Settings = user.Settings ?? new ApplicationUserSettings();

            var db = redis.GetDatabase();
            var achievementHash = db.StringGetAsync("cache:achievement:hash");
            var journalHash = db.StringGetAsync("cache:journal-enUS:hash");
            var manualHash = db.StringGetAsync("cache:manual-enUS:hash");
            var staticHash = db.StringGetAsync("cache:static-enUS:hash");
            Task.WaitAll(achievementHash, journalHash, staticHash);

            AchievementHash = achievementHash.Result;
            JournalHash = journalHash.Result;
            ManualHash = manualHash.Result;
            StaticHash = staticHash.Result;

            Settings.Migrate();
            SettingsJson = JsonConvert.SerializeObject(Settings);
        }
    }
}
