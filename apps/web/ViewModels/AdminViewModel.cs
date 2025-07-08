namespace Wowthing.Web.ViewModels;

public class AdminViewModel
{
    public readonly string SettingsJson;

    public AdminViewModel(string settingsJson)
    {
        SettingsJson = settingsJson;
    }
}
