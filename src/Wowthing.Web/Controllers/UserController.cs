using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using Wowthing.Lib.Models;
using Wowthing.Web.Models;
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

            return View(new UserViewModel(_redis, user));
        }
    }
}
