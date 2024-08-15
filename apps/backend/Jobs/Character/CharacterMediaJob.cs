using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterMediaJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/character-media";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterMedia resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterMedia>(uri, useLastModified: false);
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
        var media = await Context.PlayerCharacterMedia.FindAsync(_query.CharacterId);
        if (media == null)
        {
            media = new PlayerCharacterMedia
            {
                CharacterId = _query.CharacterId,
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

        await Context.SaveChangesAsync(CancellationToken);

        /*if (!string.IsNullOrWhiteSpace(media.MainUrl))
        {
            await JobRepository.AddImageJobAsync(ImageType.CharacterFull, query.CharacterId, ImageFormat.Jpeg, media.MainUrl);
        }*/

        if (!string.IsNullOrWhiteSpace(media.MainRawUrl))
        {
            await JobRepository.AddImageJobAsync(ImageType.Character, _query.CharacterId, ImageFormat.WebP, media.MainRawUrl);
        }
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
