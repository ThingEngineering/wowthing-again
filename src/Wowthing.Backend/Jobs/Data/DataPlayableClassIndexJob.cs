using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataPlayableClassIndexJob : JobBase, IScheduledJob
    {
        public static ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.DataPlayableClassIndex,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromDays(1),
        };

        private const string API_PATH = "data/wow/playable-class/index";

        public override async Task Run(params string[] data)
        {
            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, API_PATH);
            var result = await GetJson<ApiDataPlayableClassIndex>(uri);
            
            foreach (var apiClass in result.Classes)
            {
                // Absolute garbage API design on Blizzard's part, cool
                await AddJobAsync(JobPriority.High, JobType.DataPlayableClass, apiClass.Id.ToString());
            }
        }
    }
}
