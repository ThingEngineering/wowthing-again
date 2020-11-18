using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly CharacterRepository _characterRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(CharacterRepository characterRepository, UserManager<ApplicationUser> userManager)
        {
            _characterRepository = characterRepository;
            _userManager = userManager;
        }

        [HttpGet("user/{username:minlength(4)}")]
        public async Task<IActionResult> Index(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            // J a n k
            var characters = (await _characterRepository.GetCharactersByUserId(user.Id))
                .Where(c => c.Level >= 10).ToList();

            return View(new UserViewModel(user, characters));
        }
    }
}
