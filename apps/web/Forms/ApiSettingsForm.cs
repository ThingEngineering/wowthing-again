using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Forms
{
    public class ApiSettingsForm
    {
        public Dictionary<int, PlayerAccount> Accounts { get; set; }
        public ApplicationUserSettings Settings { get; set; }
    }
}
