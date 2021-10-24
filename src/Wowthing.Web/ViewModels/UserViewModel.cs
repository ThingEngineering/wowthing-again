using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;
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
        public readonly string ZoneMapHash;

        public UserViewModel(IConnectionMultiplexer redis, ApplicationUser user)
        {
            User = user;
            Settings = user.Settings ?? new ApplicationUserSettings();

            var db = redis.GetDatabase();
            var achievementsHash = db.StringGetAsync("cached_achievements:hash");
            var staticHash = db.StringGetAsync("cached_static:hash");
            var transmogHash = db.StringGetAsync("cache:transmog:hash");
            var zoneMapHash = db.StringGetAsync("cache:zone-map:hash");
            Task.WaitAll(achievementsHash, staticHash, transmogHash, zoneMapHash);

            AchievementsHash = achievementsHash.Result;
            StaticHash = staticHash.Result;
            TransmogHash = transmogHash.Result;
            ZoneMapHash = zoneMapHash.Result;

            Settings.Validate();
            SettingsJson = JsonConvert.SerializeObject(Settings);
        }
    }
}
