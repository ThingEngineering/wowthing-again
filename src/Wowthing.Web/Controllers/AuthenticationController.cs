using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Database.Models;
using Wowthing.Web.Extensions;

namespace Wowthing.Web.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthenticationController(ILogger<AuthenticationController> logger, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // Shows the login page with providers
        [HttpGet("auth/login")]
        public async Task<IActionResult> Login()
        {
            return View(await HttpContext.GetExternalProvidersAsync());
        }

        // Starts the OAuth login process
        [HttpPost("auth/login")]
        public IActionResult Login([FromForm] string provider)
        {
            var redirectUrl = Url.Action("Callback", "Authentication");
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return new ChallengeResult(provider, properties);
        }

        [HttpGet("auth/callback")]
        public async Task<IActionResult> Callback(string returnUrl = null, string remoteError = null)
        {
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                throw new Exception("uh-oh");
            }

            foreach (var claim in info.Principal.Claims)
            {
                _logger.LogDebug($"Type: {claim.Type} | Value: {claim.Value}");
            }

            string userId = info.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                user = new ApplicationUser()
                {
                    Id = userId,
                    UserName = Guid.NewGuid().ToString("N").ToLowerInvariant(),
                };
                // TODO validate
                var createResult = await _userManager.CreateAsync(user);
                // TODO validate
                var addLoginResult = await _userManager.AddLoginAsync(user, info);
            }

            // TODO validate
            var signInResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, true);
            return Redirect("/");
        }

        [HttpGet("auth/logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Redirect("/");
        }
    }
}
