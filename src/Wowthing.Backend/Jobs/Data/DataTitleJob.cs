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
            int titleId = int.Parse(data[0]);

            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, string.Format(API_PATH, titleId));
            var result = await GetJson<ApiDataTitle>(uri);
            if (result.NotModified)
            {
                return;
            }
            var apiTitle = result.Data;

            // Fetch existing data
            var title = await _context.WowTitle.FirstOrDefaultAsync(c => c.Id == titleId);
            if (title == null)
            {
                title = new WowTitle
                {
                    Id = titleId,
                };
                _context.WowTitle.Add(title);
            }

            // Update object
            title.Name = apiTitle.Name;
            title.TitleFemale = apiTitle.GenderName.Female;
            title.TitleMale = apiTitle.GenderName.Male;

            await _context.SaveChangesAsync();
        }
    }
}
