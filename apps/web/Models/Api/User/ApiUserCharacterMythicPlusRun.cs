using Wowthing.Lib.Models.Player;
using Wowthing.Web.Converters;

namespace Wowthing.Web.Models.Api.User;

[JsonConverter(typeof(ApiUserCharacterMythicPlusRunConverter))]
public class ApiUserCharacterMythicPlusRun : PlayerCharacterAddonDataMythicPlusRun
{
    public ApiUserCharacterMythicPlusRun(PlayerCharacterAddonDataMythicPlusRun run)
    {
        Completed = run.Completed;
        Level = run.Level;
        MapId = run.MapId;
        Score = run.Score;
    }
}
