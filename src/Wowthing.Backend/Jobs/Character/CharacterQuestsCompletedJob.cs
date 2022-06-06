using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterQuestsCompletedJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/quests/completed";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]) ??
                        throw new InvalidJsonException(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            ApiCharacterQuestsCompleted resultData;
            var uri = GenerateUri(query, ApiPath);
            try
            {
                var result = await GetJson<ApiCharacterQuestsCompleted>(uri);
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
            var quests = await Context.PlayerCharacterQuests.FindAsync(query.CharacterId);
            if (quests == null)
            {
                quests = new PlayerCharacterQuests
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterQuests.Add(quests);
            }

            quests.CompletedIds = resultData.Quests
                .EmptyIfNull()
                .Select(q => q.Id)
                .ToList();

            await Context.SaveChangesAsync();
        }
    }
}
