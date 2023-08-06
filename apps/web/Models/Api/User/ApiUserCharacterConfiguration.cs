using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserCharacterConfiguration
{
    public short BackgroundId { get; set; }
    public short BackgroundBrightness { get; set; }
    public short BackgroundSaturation { get; set; }

    public ApiUserCharacterConfiguration(PlayerCharacterConfiguration config)
    {
        BackgroundId = config?.BackgroundId ?? -1;
        BackgroundBrightness = config?.BackgroundBrightness ?? -1;
        BackgroundSaturation = config?.BackgroundSaturation ?? -1;
    }
}