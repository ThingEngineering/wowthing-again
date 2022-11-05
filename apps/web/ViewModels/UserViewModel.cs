using StackExchange.Redis;
using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels;

public class UserViewModel
{
    public readonly ApplicationUser User;
    public readonly ApplicationUserSettings Settings;
    public readonly bool IsPrivate;
    public readonly string SettingsJson;
    public readonly string AchievementHash;
    public readonly string AppearanceHash;
    public readonly string ItemHash;
    public readonly string JournalHash;
    public readonly string ManualHash;
    public readonly string StaticHash;

    public UserViewModel(IConnectionMultiplexer redis, ApplicationUser user, bool isPrivate)
    {
        User = user;
        Settings = user.Settings ?? new ApplicationUserSettings();
        IsPrivate = isPrivate;

        var db = redis.GetDatabase();
        var achievementHash = db.StringGetAsync("cache:achievement-enUS:hash");
        var appearanceHash = db.StringGetAsync("cache:appearance:hash");
        var itemHash = db.StringGetAsync("cache:item-enUS:hash");
        var journalHash = db.StringGetAsync("cache:journal-enUS:hash");
        var manualHash = db.StringGetAsync("cache:manual-enUS:hash");
        var staticHash = db.StringGetAsync("cache:static-enUS:hash");
        Task.WaitAll(achievementHash, appearanceHash, itemHash, journalHash, manualHash, staticHash);

        AchievementHash = achievementHash.Result;
        AppearanceHash = appearanceHash.Result;
        ItemHash = itemHash.Result;
        JournalHash = journalHash.Result;
        ManualHash = manualHash.Result;
        StaticHash = staticHash.Result;

        Settings.Migrate();
        SettingsJson = JsonConvert.SerializeObject(Settings);
    }
}
