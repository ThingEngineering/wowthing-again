using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Web.Converters;

namespace Wowthing.Web.Models.Api.User;

[JsonConverter(typeof(ApiUserCharacterWeeklyConverter))]
public class ApiUserCharacterWeekly
{
    public DateTime KeystoneScannedAt { get; set; }
    public DateTime UghQuestsScannedAt { get; set; }

    public List<int> DelveLevels { get; set; }
    public List<string> DelveMaps { get; set; }
    public int DelveWeek { get; set; }

    public int KeystoneDungeon { get; set; }
    public int KeystoneLevel { get; set; }
    public PlayerCharacterWeeklyVault Vault { get; set; }

    public ApiUserCharacterWeekly(PlayerCharacterWeekly weekly, bool pub, ApplicationUserSettingsPrivacy privacy)
    {
        DelveLevels = weekly.DelveLevels;
        DelveMaps = weekly.DelveMaps;
        DelveWeek = weekly.DelveWeek;
        Vault = weekly.Vault;

        if (!pub || privacy?.PublicMythicPlus == true)
        {
            KeystoneDungeon = weekly.KeystoneDungeon;
            KeystoneLevel = weekly.KeystoneLevel;
            KeystoneScannedAt = weekly.KeystoneScannedAt;
        }
    }
}
