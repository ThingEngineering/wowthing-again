using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataPlayableRaceIndexJob : JobBase, IScheduledJob
    {
        public static ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.DataPlayableRaceIndex,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromDays(1),
        };

        private const string API_PATH = "data/wow/playable-race/index";

        public override async Task Run(params string[] data)
        {
            // Fetch existing data
            var raceMap = await _context.WowRace.ToDictionaryAsync(k => k.Id);

            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, API_PATH);
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

            _context.WowRace.AddRange(newRaces);
            await _context.SaveChangesAsync();
        }
    }
}
