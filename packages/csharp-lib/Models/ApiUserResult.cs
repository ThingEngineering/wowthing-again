namespace Wowthing.Lib.Models;

public class ApiUserResult
{
    public bool Banned { get; set; }
    public bool NotFound { get; set; }
    public bool Public { get; set; }
    public ApplicationUser User { get; set; }
    public ApplicationUserSettingsPrivacy Privacy { get; set; }
}
