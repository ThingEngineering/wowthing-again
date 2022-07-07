﻿using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterReputationsJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/reputations";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]) ??
                        throw new InvalidJsonException(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            ApiCharacterReputations resultData;
            var uri = GenerateUri(query, ApiPath);
            try
            {
                var result = await GetJson<ApiCharacterReputations>(uri, useLastModified: false);
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
            var pcReputations = await Context.PlayerCharacterReputations.FindAsync(query.CharacterId);
            if (pcReputations == null)
            {
                pcReputations = new PlayerCharacterReputations
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterReputations.Add(pcReputations);
            }

            var sortedReputations = resultData.Reputations
                .OrderBy(rep => rep.Faction.Id)
                .ToArray();

            var reputationIds = sortedReputations
                .Select(rep => rep.Faction.Id)
                .ToList();
            if (pcReputations.ReputationIds == null || !reputationIds.SequenceEqual(pcReputations.ReputationIds))
            {
                pcReputations.ReputationIds = reputationIds;
            }

            var reputationValues =  sortedReputations
                .Select(r => r.Standing.Raw)
                .ToList();
            if (pcReputations.ReputationValues == null || !reputationValues.SequenceEqual(pcReputations.ReputationValues))
            {
                pcReputations.ReputationValues = reputationValues;
            }

            int updated = await Context.SaveChangesAsync();
            if (updated > 0)
            {
                await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, query.UserId);
            }
        }
    }
}
