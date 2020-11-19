using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowDbContext _context;

        public UserController(UserManager<ApplicationUser> userManager, WowDbContext context)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("user/{username:minlength(4)}")]
        public async Task<IActionResult> Index([FromRoute] string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            // TODO checks:
            //      - user == logged in user? all data
            //      - user != logged in user? limited data (min level, etc)
            //        - check anonymize data setting
            var characters = await _context.UserCharacter.Where(c => c.Account.UserId == user.Id && c.Level >= 10).ToListAsync();

            return View(new UserViewModel(user, characters, new Dictionary<int, WowRace>()));
        }
    }
}
