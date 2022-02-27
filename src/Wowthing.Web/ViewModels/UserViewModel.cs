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
        public readonly string StaticHash;
        public readonly string TransmogHash;
        public readonly string ZoneMapHash;

        public UserViewModel(IConnectionMultiplexer redis, ApplicationUser user)
        {
            User = user;
            Settings = user.Settings ?? new ApplicationUserSettings();

            var db = redis.GetDatabase();
            var achievementHash = db.StringGetAsync("cache:achievement:hash");
            var journalHash = db.StringGetAsync("cache:journal-enUS:hash");
            var staticHash = db.StringGetAsync("cache:static-enUS:hash");
            var transmogHash = db.StringGetAsync("cache:transmog:hash");
            var zoneMapHash = db.StringGetAsync("cache:zone-map:hash");
            Task.WaitAll(achievementHash, journalHash, staticHash, transmogHash, zoneMapHash);

            AchievementHash = achievementHash.Result;
            JournalHash = journalHash.Result;
            StaticHash = staticHash.Result;
            TransmogHash = transmogHash.Result;
            ZoneMapHash = zoneMapHash.Result;

            Settings.Validate();
            SettingsJson = JsonConvert.SerializeObject(Settings);
        }
    }
}
