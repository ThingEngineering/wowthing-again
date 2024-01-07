using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserCharacterAddonDataMythicPlus
{
    public Dictionary<int, PlayerCharacterAddonDataMythicPlusMap> Maps { get; set; }
    public List<PlayerCharacterAddonDataMythicPlusRun> RawRuns { get; set; }

    public ApiUserCharacterAddonDataMythicPlus(PlayerCharacterAddonDataMythicPlus mythicPlus)
    {
        Maps = mythicPlus.Maps;
        RawRuns = mythicPlus.Runs;
    }
}
