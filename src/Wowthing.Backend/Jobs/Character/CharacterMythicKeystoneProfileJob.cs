using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterMythicKeystoneProfileJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/mythic-keystone-profile";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            var path = string.Format(ApiPath, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterMythicKeystoneProfile>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }
            
            // Fetch character data
            var mythicPlus = await Context.PlayerCharacterMythicPlus.FindAsync(query.CharacterId);
            if (mythicPlus == null)
            {
                mythicPlus = new PlayerCharacterMythicPlus
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterMythicPlus.Add(mythicPlus);
            }

            mythicPlus.CurrentPeriodId = result.Data.CurrentPeriod.Period.Id;
            mythicPlus.PeriodRuns = new List<PlayerCharacterMythicPlusRun>();

            if (result.Data.CurrentPeriod.BestRuns != null)
            {
                mythicPlus.PeriodRuns = result.Data.CurrentPeriod.BestRuns
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
            }

            await Context.SaveChangesAsync();

            // Start jobs for all seasons
            foreach (var apiSeason in result.Data?.Seasons ?? Enumerable.Empty<ApiObnoxiousObject>())
            { 
                await JobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterMythicKeystoneProfileSeason, data[0], apiSeason.Id.ToString());
            }
        }
    }
}
