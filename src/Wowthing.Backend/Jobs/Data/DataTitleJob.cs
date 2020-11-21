using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataTitleJob : JobBase
    {
        private const string API_PATH = "data/wow/title/{0}";

        public override async Task Run(params string[] data)
        {
            // Fetch existing data
            int titleId = int.Parse(data[0]);
            var title = await _context.WowTitle.FirstOrDefaultAsync(c => c.Id == titleId);
            if (title == null)
            {
                title = new WowTitle
                {
                    Id = titleId,
                };
                _context.WowTitle.Add(title);
            }

            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, string.Format(API_PATH, titleId));
            var apiTitle = await GetJson<ApiDataTitle>(uri, useCache: true);

            // Update object
            title.Name = apiTitle.Name;
            title.TitleFemale = apiTitle.GenderName.Female;
            title.TitleMale = apiTitle.GenderName.Male;

            await _context.SaveChangesAsync();
        }
    }
}
