using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserCharacterWeekly
{
    public DateTime KeystoneScannedAt { get; set; }
    public DateTime UghQuestsScannedAt { get; set; }

    public int KeystoneDungeon { get; set; }
    public int KeystoneLevel { get; set; }
    public PlayerCharacterWeeklyVault Vault { get; set; }

    public ApiUserCharacterWeekly(PlayerCharacterWeekly weekly, bool pub, ApplicationUserSettingsPrivacy privacy)
    {
        Vault = weekly.Vault;

        if (!pub || privacy?.PublicMythicPlus == true)
        {
            KeystoneDungeon = weekly.KeystoneDungeon;
            KeystoneLevel = weekly.KeystoneLevel;
            KeystoneScannedAt = weekly.KeystoneScannedAt;
        }
    }
}
