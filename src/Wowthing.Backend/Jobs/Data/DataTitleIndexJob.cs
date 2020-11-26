using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataTitleIndexJob : JobBase, IScheduledJob
    {
        public static ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.DataTitleIndex,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromDays(1),
        };

        private const string API_PATH = "data/wow/title/index";

        public override async Task Run(params string[] data)
        {
            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, API_PATH);
            var result = await GetJson<ApiDataTitleIndex>(uri);
            if (result.NotModified)
            {
                return;
            }

            foreach (var apiTitle in result.Data.Titles)
            {
                // Absolute garbage API design on Blizzard's part, cool
                await _jobRepository.AddJobAsync(JobPriority.High, JobType.DataTitle, apiTitle.Id.ToString());
            }
        }
    }
}
