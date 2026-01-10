using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels;

public class UserViewModel
{
    public readonly ApplicationUser User;
    public readonly ApplicationUserSettings Settings;
    public readonly bool IsPrivate;
    public readonly string ModifiedJson;
    public readonly string SettingsJson;
    public readonly string AchievementHash;
    public readonly string AppearanceHash;
    public readonly string DbHash;
    public readonly string ItemHash;
    public readonly string JournalHash;
    public readonly string ManualHash;
    public readonly string StaticHash;
    public readonly string BebopItemHash;

    public UserViewModel(
        Dictionary<string, string> hashes,
        ApplicationUser user,
        ApplicationUserSettings settings,
        string modifiedJson,
        string settingsJson,
        bool isPrivate
    )
    {
        User = user;
        Settings = settings;
        ModifiedJson = modifiedJson;
        SettingsJson = settingsJson;
        IsPrivate = isPrivate;

        AchievementHash = hashes["Achievement"];
        AppearanceHash = hashes["Appearance"];
        DbHash = hashes["Db"];
        ItemHash = hashes["Item"];
        JournalHash = hashes["Journal"];
        ManualHash = hashes["Manual"];
        StaticHash = hashes["Static"];
        BebopItemHash = hashes["BebopItem"];
    }
}
