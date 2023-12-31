using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterMediaJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/character-media";

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        // Fetch API data
        ApiCharacterMedia resultData;
        var uri = GenerateUri(query, ApiPath);
        try
        {
            var result = await GetJson<ApiCharacterMedia>(uri, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        // Fetch character data
        var media = await Context.PlayerCharacterMedia.FindAsync(query.CharacterId);
        if (media == null)
        {
            media = new PlayerCharacterMedia
            {
                CharacterId = query.CharacterId,
            };
            Context.PlayerCharacterMedia.Add(media);
        }

        // Parse API data
        var assetMap = resultData.Assets
            .EmptyIfNull()
            .ToDictionary(
                asset => asset.Key,
                asset => asset.Value
            );

        media.AvatarUrl = assetMap.GetValueOrDefault("avatar");
        media.InsetUrl = assetMap.GetValueOrDefault("inset");
        media.MainUrl = assetMap.GetValueOrDefault("main");
        media.MainRawUrl = assetMap.GetValueOrDefault("main-raw");

        int updated = await Context.SaveChangesAsync();
        if (updated > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, query.UserId);
        }

        /*if (!string.IsNullOrWhiteSpace(media.MainUrl))
        {
            await JobRepository.AddImageJobAsync(ImageType.CharacterFull, query.CharacterId, ImageFormat.Jpeg, media.MainUrl);
        }*/

        if (!string.IsNullOrWhiteSpace(media.MainRawUrl))
        {
            await JobRepository.AddImageJobAsync(ImageType.Character, query.CharacterId, ImageFormat.WebP, media.MainRawUrl);
        }
    }
}
