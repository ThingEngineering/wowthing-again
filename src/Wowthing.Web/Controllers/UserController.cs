using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using Wowthing.Lib.Models;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(IConnectionMultiplexer redis, UserManager<ApplicationUser> userManager)
        {
            _redis = redis;
            _userManager = userManager;
        }

        [HttpGet("user/{username:username}")]
        public async Task<IActionResult> Index([FromRoute] string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null || (User?.Identity?.Name != user.UserName && user.Settings?.Privacy?.Public != true))
            {
                return NotFound();
            }

            var settings = user.Settings ?? new ApplicationUserSettings();

            var db = _redis.GetDatabase();
            var achievementsHash = db.StringGetAsync("cached_achievements:hash");
            var farmHash = db.StringGetAsync("cache:farm:hash");
            var staticHash = db.StringGetAsync("cached_static:hash");
            var transmogHash = db.StringGetAsync("cache:transmog:hash");
            Task.WaitAll(achievementsHash, farmHash, staticHash, transmogHash);

            return View(new UserViewModel(user, settings, achievementsHash.Result, farmHash.Result, staticHash.Result, transmogHash.Result));
        }
    }
}
