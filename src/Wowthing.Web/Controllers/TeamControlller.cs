using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Team;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class TeamController : Controller
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly WowDbContext _context;

        public TeamController(IConnectionMultiplexer redis, WowDbContext context)
        {
            _redis = redis;
            _context = context;
        }

        [HttpGet("team/{guid:guid}")]
        public async Task<IActionResult> GetTeamByGuid([FromRoute] Guid guid)
        {
            var team = await _context.Team.FirstOrDefaultAsync(t => t.Guid == guid);
            return await GetTeam(team);
        }

        [HttpGet("team/{slug:slug}")]
        public async Task<IActionResult> GetTeamBySlug([FromRoute] string slug)
        {
            var team = await _context.Team.FirstOrDefaultAsync(t => t.Slug == slug);
            return await GetTeam(team);
        }

        private async Task<IActionResult> GetTeam(Team team)
        {
            if (team == null)
            {
                return NotFound();
            }

            var db = _redis.GetDatabase();
            var staticHash = await db.StringGetAsync("cached_static:hash");

            return View("Details", new TeamViewModel(team, staticHash));
        }

        [HttpPost("team/add_character")]
        public IActionResult AddCharacter()
        {
            return Ok();
        }
    }
}
