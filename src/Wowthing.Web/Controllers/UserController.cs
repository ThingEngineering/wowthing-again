using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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

            ApplicationUserSettings settings = null;
            if (User?.Identity?.IsAuthenticated == true)
            {
                var settingsUser = await _userManager.FindByNameAsync(User.Identity.Name);
                settings = settingsUser?.Settings;
            }

            if (settings == null)
            {
                settings = new ApplicationUserSettings();
            }

            var db = _redis.GetDatabase();
            var achievementsHash = await db.StringGetAsync("cached_achievements:hash");
            var staticHash = await db.StringGetAsync("cached_static:hash");

            return View(new UserViewModel(user, settings, achievementsHash, staticHash));
        }
    }
}
