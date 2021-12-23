using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterMediaJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/character-media";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var uri = GenerateUri(query, ApiPath);
            var result = await GetJson<ApiCharacterMedia>(uri);
            if (result.NotModified)
            {
                LogNotModified();
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
            var assetMap = result.Data.Assets
                .EmptyIfNull()
                .ToDictionary(
                    asset => asset.Key,
                    asset => asset.Value
                );

            media.AvatarUrl = assetMap.GetValueOrDefault("avatar");
            media.InsetUrl = assetMap.GetValueOrDefault("inset");
            media.MainUrl = assetMap.GetValueOrDefault("main");
            media.MainRawUrl = assetMap.GetValueOrDefault("main-raw");

            await Context.SaveChangesAsync();
        }
    }
}
