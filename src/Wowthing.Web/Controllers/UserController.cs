using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowDbContext _context;

        public UserController(IConnectionMultiplexer redis, UserManager<ApplicationUser> userManager, WowDbContext context)
        {
            _redis = redis;
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("user/{username:username}")]
        public async Task<IActionResult> Index([FromRoute] string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            var db = _redis.GetDatabase();
            var staticHash = await db.StringGetAsync("cached_static:hash");

            return View(new UserViewModel(user, staticHash));
        }
    }
}
