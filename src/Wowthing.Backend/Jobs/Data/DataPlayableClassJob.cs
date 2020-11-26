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
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataPlayableClassJob : JobBase
    {
        private const string API_PATH = "data/wow/playable-class/{0}";

        public override async Task Run(params string[] data)
        {
            int classId = int.Parse(data[0]);

            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, string.Format(API_PATH, classId));
            var result = await GetJson<ApiDataPlayableClass>(uri);
            if (result.NotModified)
            {
                return;
            }

            var apiClass = result.Data;

            // Fetch existing data
            var cls = await _context.WowClass.FirstOrDefaultAsync(c => c.Id == classId);
            if (cls == null)
            {
                cls = new WowClass
                {
                    Id = classId,
                };
                _context.WowClass.Add(cls);
            }

            // Update object
            string baseName = apiClass.Name.Replace(' ', '_').ToLowerInvariant();
            string iconName = $"class_{baseName}";

            cls.Name = apiClass.Name;
            cls.Icon = iconName;
            cls.SpecializationIds = apiClass.Specializations.Select(s => s.Id).ToList();

            await _context.SaveChangesAsync();
        }
    }
}
