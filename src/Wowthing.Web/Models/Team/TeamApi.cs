using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Models
{
    public class TeamApi
    {
        public int Id { get; set; }
        public WowRegion Region { get; set; }
        public int DefaultRealmId { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public List<TeamApiCharacter> Characters { get; set; }

        public TeamApi(WowDbContext context, Team team)
        {
            Id = team.Id;
            Region = team.Region;
            DefaultRealmId = team.DefaultRealmId;
            Name = team.Name;
            Slug = team.Slug;
            Description = team.Description;

            Characters = team.Characters
                .Select(c => new TeamApiCharacter(context, c))
                .ToList();
        }
    }
}
