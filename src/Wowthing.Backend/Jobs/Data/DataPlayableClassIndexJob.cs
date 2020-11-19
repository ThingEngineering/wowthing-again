using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataPlayableClassIndexJob : JobBase
    {
        private const string API_PATH = "data/wow/playable-class/index";

        private readonly DataRepository _dataRepository;

        public DataPlayableClassIndexJob(IServiceScope serviceScope) : base(serviceScope)
        {
            _dataRepository = GetService<DataRepository>();
        }

        public override async Task Run(params string[] data)
        {
            // Fetch API data
            var uri = GenerateUri(ApiRegion.US, ApiNamespace.Static, API_PATH);
            var result = await GetJson<ApiDataPlayableClassIndex>(uri);
            
            foreach (var apiClass in result.Classes)
            {
                // Absolute garbage API design on Blizzard's part, cool
                await AddJobAsync(JobPriority.High, JobType.DataPlayableClass, apiClass.Id.ToString());
            }
        }
    }
}
