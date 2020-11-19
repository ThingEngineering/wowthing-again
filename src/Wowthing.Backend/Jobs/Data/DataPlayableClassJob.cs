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
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataPlayableClassJob : JobBase
    {
        private const string API_PATH = "data/wow/playable-class/{0}";

        private readonly DataRepository _dataRepository;

        public DataPlayableClassJob(IServiceScope serviceScope) : base(serviceScope)
        {
            _dataRepository = GetService<DataRepository>();
        }

        public override async Task Run(params string[] data)
        {
            // Fetch existing data
            int classId = int.Parse(data[0]);
            var cls = await _dataRepository.GetClassById(classId);
            if (cls == null)
            {
                cls = new WowClass
                {
                    Id = classId,
                };
            }

            // Fetch API data
            var uri = GenerateUri(ApiRegion.US, ApiNamespace.Static, string.Format(API_PATH, classId));
            var apiClass = await GetJson<ApiDataPlayableClass>(uri);
            _logger.Debug("uri={0} apiClass={@1}", uri.ToString(), apiClass);

            // Update object
            string baseName = apiClass.Name.Replace(' ', '_').ToLowerInvariant();
            string iconName = $"class_{baseName}";

            cls.Name = apiClass.Name;
            cls.Icon = iconName;
            cls.SpecializationIds = apiClass.Specializations.Select(s => s.Id).ToList();

            _dataRepository.AddClass(cls);
            await _dataRepository.SaveChangesAsync();
        }
    }
}
