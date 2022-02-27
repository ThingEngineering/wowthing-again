using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Repositories;
using Wowthing.Web.Extensions;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly JobRepository _jobRepository;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UriService _uriService;

        public AuthenticationController(
            ILogger<AuthenticationController> logger,
            JobRepository jobRepository,
            SignInManager<ApplicationUser> signInManager,
            UriService uriService,
            UserManager<ApplicationUser> userManager
        )
        {
            _logger = logger;
            _jobRepository = jobRepository;
            _signInManager = signInManager;
            _uriService = uriService;
            _userManager = userManager;
        }

        // Shows the login page with providers
        [HttpGet("auth/login")]
        public IActionResult Login(string returnUrl = null)
        {
            var redirectUrl = Url.Action("Callback", "Authentication", new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties("BattleNet", redirectUrl);
            return new ChallengeResult("BattleNet", properties);
        }

        [HttpGet("auth/callback")]
        public async Task<IActionResult> Callback(string returnUrl = null, string remoteError = null)
        {
            if (remoteError != null)
            {
                // TODO useful error
                throw new Exception(remoteError);
            }

            var loginInfo = await _signInManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                // TODO useful error
                throw new Exception("uh-oh");
            }

            foreach (var claim in loginInfo.Principal.Claims)
            {
                _logger.LogDebug($"Claim! Type: {claim.Type} | Value: {claim.Value}");
            }
            foreach (var token in loginInfo.AuthenticationTokens)
            {
                _logger.LogDebug($"Token! Name: {token.Name} | Value: {token.Value}");
            }

            long userId = long.Parse(loginInfo.Principal.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                user = new ApplicationUser()
                {
                    Id = userId,
                    UserName = Guid.NewGuid().ToString("N").ToLowerInvariant(),
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    // TODO useful error
                    //   createResult.Errors?
                    throw new Exception("create fail");
                }

                var addLoginResult = await _userManager.AddLoginAsync(user, loginInfo);
                if (!addLoginResult.Succeeded)
                {
                    // TODO useful error
                    //   addLoginResult.Errors?
                    throw new Exception("create fail");
                }
            }

            // Ensure user settings are created and migrated
            if (user.Settings == null)
            {
                user.Settings = new ApplicationUserSettings();
            }
            user.Settings.Migrate();

            await _userManager.UpdateAsync(user);

            // Sign in the user
            var props = new AuthenticationProperties();
            props.StoreTokens(loginInfo.AuthenticationTokens);
            props.IsPersistent = true;
            await _signInManager.SignInAsync(user, props);

            // Store the external tokens in AspNetUserTokens, we need `access_token` to pull character list
            await _signInManager.UpdateExternalAuthenticationTokensAsync(loginInfo);

            // Queue a job to retrieve their characters
            await _jobRepository.AddJobAsync(JobPriority.High, JobType.UserCharacters, user.Id.ToString());

            if (string.IsNullOrWhiteSpace(returnUrl))
            {
                returnUrl = await _uriService.GetUriForUser(user: user);
            }
            return Redirect(returnUrl);
        }

        [Authorize]
        [HttpGet("auth/logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Redirect("/");
        }
    }
}
