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
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataPlayableRacesJob : JobBase
    {
        private const string API_PATH = "data/wow/playable-race/index";
        private readonly DataRepository _dataRepository;

        public DataPlayableRacesJob(HttpClient http, ILogger logger, IServiceScope serviceScope) : base(http, logger, serviceScope)
        {
            _dataRepository = GetService<DataRepository>();
        }

        public override async Task Run(params string[] data)
        {
            // Fetch existing data
            var raceMap = (await _dataRepository.GetAllRaces())
                .ToDictionary(k => k.Id);

            // Fetch API data
            var uri = GenerateUri(ApiRegion.US, ApiNamespace.Static, API_PATH);
            var result = await GetJson<ApiDataPlayableRaces>(uri);

            var newRaces = new List<WowRace>();
            foreach (var race in result.Races)
            {
                string baseName = race.Name.Replace(' ', '_').ToLowerInvariant();
                string iconFemale = $"race_{baseName}_female";
                string iconMale = $"race_{baseName}_male";

                if (raceMap.TryGetValue(race.Id, out WowRace existing))
                {
                    existing.Name = race.Name;
                    existing.IconFemale = iconFemale;
                    existing.IconMale = iconMale;
                }
                else
                {
                    newRaces.Add(new WowRace
                    {
                        Id = race.Id,
                        Name = race.Name,
                        IconFemale = iconFemale,
                        IconMale = iconMale,
                    });
                }
            }

            _dataRepository.AddRaces(newRaces);
            await _dataRepository.SaveChangesAsync();
        }
    }
}
