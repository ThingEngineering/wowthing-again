using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceStack.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly IRedisClientsManager _redis;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowDbContext _context;

        public UserController(IRedisClientsManager redis, UserManager<ApplicationUser> userManager, WowDbContext context)
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

            var db = await _redis.GetClientAsync();
            var staticHash = await db.GetValueAsync("cached_static:hash");

            return View(new UserViewModel(user, staticHash));
        }
    }
}
