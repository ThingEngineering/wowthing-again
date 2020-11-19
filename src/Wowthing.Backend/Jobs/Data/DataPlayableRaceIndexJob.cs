using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Backend.Services;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataPlayableRaceIndexJob : JobBase
    {
        private const string API_PATH = "data/wow/playable-race/index";
        
        private readonly DataRepository _dataRepository;

        public DataPlayableRaceIndexJob(IServiceScope serviceScope) : base(serviceScope)
        {
            _dataRepository = GetService<DataRepository>();
        }

        public override async Task Run(params string[] data)
        {
            // Fetch existing data
            var raceMap = await _dataRepository.GetAllRaces()
                .ToDictionaryAsync(k => k.Id);

            // Fetch API data
            var uri = GenerateUri(ApiRegion.US, ApiNamespace.Static, API_PATH);
            var result = await GetJson<ApiDataPlayableRaceIndex>(uri);

            var newRaces = new List<WowRace>();
            foreach (var apiRace in result.Races)
            {
                string baseName = apiRace.Name.Replace(' ', '_').ToLowerInvariant();
                string iconFemale = $"race_{baseName}_female";
                string iconMale = $"race_{baseName}_male";

                if (!raceMap.TryGetValue(apiRace.Id, out WowRace race))
                {
                    race = new WowRace
                    {
                        Id = apiRace.Id,
                    };
                    newRaces.Add(race);
                }

                race.Name = apiRace.Name;
                race.IconFemale = iconFemale;
                race.IconMale = iconMale;
            }

            _dataRepository.AddRaces(newRaces);
            await _dataRepository.SaveChangesAsync();
        }
    }
}
