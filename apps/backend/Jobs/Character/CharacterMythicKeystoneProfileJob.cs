using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterMythicKeystoneProfileJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/mythic-keystone-profile";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterMythicKeystoneProfile resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterMythicKeystoneProfile>(uri, useLastModified: false);
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
        var mythicPlus = await Context.PlayerCharacterMythicPlus.FindAsync(_query.CharacterId);
        if (mythicPlus == null)
        {
            mythicPlus = new PlayerCharacterMythicPlus
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterMythicPlus.Add(mythicPlus);
        }

        mythicPlus.CurrentPeriodId = resultData.CurrentPeriod.Period.Id;

        mythicPlus.PeriodRuns = resultData.CurrentPeriod.BestRuns
            .EmptyIfNull()
            .Select(run => new PlayerCharacterMythicPlusRun
            {
                Affixes = run.Affixes.Select(a => a.Id).ToList(),
                Completed = run.CompletedTimestamp.AsUtcTimestamp(),
                DungeonId = run.Dungeon.Id,
                Duration = run.Duration,
                KeystoneLevel = run.KeystoneLevel,
                Members = run.Members.Select(member => new PlayerCharacterMythicPlusRunMember
                {
                    ItemLevel = member.ItemLevel,
                    Name = member.Character.Name,
                    RealmId = member.Character.Realm.Id,
                    SpecializationId = member.Specialization.Id,
                }).ToList(),
                Timed = run.Timed,
            })
            .ToList();

        int updated = await Context.SaveChangesAsync(CancellationToken);
        if (updated > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, _query.UserId);
        }

        // Start jobs for all seasons
        var apiSeasons = resultData.Seasons
            .EmptyIfNull()
            .Select(s => s.Id)
            .OrderByDescending(id => id)
            .ToArray();

        var existingSeasonIds = await Context.PlayerCharacterMythicPlusSeason
            .Where(mps => mps.CharacterId == _query.CharacterId)
            .OrderByDescending(mps => mps.Season)
            .Select(mps => mps.Season)
            .ToArrayAsync(CancellationToken);

        // If we've already visited every season for this character, just grab the latest
        if (apiSeasons.Length > 0 && Enumerable.SequenceEqual(apiSeasons, existingSeasonIds))
        {
            apiSeasons = new[] { apiSeasons[0] };
        }

        if (apiSeasons.Length > 0)
        {
            var db = Redis.GetDatabase();
            await db.StringIncrementAsync(string.Format(RedisKeys.CharacterJobCounter, _query.CharacterId),
                apiSeasons.Length + 1);

            await JobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterRaiderIo, data[0], JsonSerializer.Serialize(apiSeasons));

            foreach (int apiSeason in apiSeasons)
            {
                await JobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterMythicKeystoneProfileSeason, data[0], apiSeason.ToString());
            }
        }
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
