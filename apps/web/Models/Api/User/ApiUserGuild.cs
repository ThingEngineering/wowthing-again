using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Web.Converters;

namespace Wowthing.Web.Models.Api.User;

[JsonConverter(typeof(ApiUserGuildConverter))]
public class ApiUserGuild
{
    public int Id { get; set; }
    public int RealmId { get; set; }
    public string Name { get; set; }

    public PlayerGuildItem[] RawItems { get; set; }

    public ApiUserGuild(PlayerGuild guild,
        PlayerGuildItem[] items,
        bool pub,
        ApplicationUserSettingsPrivacy privacy = null)
    {
        Id = guild.Id;
        RawItems = items;

        if (pub && privacy?.Anonymized == true)
        {
            Name = $"Goose Farm {Id:X4}";
        }
        else
        {
            Name = guild.Name;
            RealmId = guild.RealmId;
        }
    }
}
