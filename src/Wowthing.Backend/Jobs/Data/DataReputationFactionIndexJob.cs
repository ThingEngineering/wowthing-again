using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataReputationFactionIndexJob : JobBase//, IScheduledJob
    {
        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.DataReputationFactionIndex,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromDays(1),
        };

        private const string API_PATH = "data/wow/reputation-faction/index";

        public override async Task Run(params string[] data)
        {
            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, API_PATH);
            var result = await GetJson<ApiDataReputationFactionIndex>(uri);
            if (result.NotModified)
            {
                return;
            }

            // Absolute garbage API design on Blizzard's part, cool
            var datas = result.Data.Factions.Select(x => x.Id.ToString());
            await _jobRepository.AddJobsAsync(JobPriority.High, JobType.DataReputationFaction, datas);
        }
    }
}
