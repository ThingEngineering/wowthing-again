using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Services;
using Wowthing.Web.Forms;

namespace Wowthing.Web.Controllers.API;

[AutoValidateAntiforgeryToken]
public class PlayerCharacterController : Controller
{
    private readonly CacheService _cacheService;
    private readonly ILogger<PlayerCharacterController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WowDbContext _context;

    public PlayerCharacterController(
        CacheService cacheService,
        ILogger<PlayerCharacterController> logger,
        UserManager<ApplicationUser> userManager,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _logger = logger;
        _userManager = userManager;
        _context = context;
    }

    [HttpPost("api/character/{characterId:int}/configuration")]
    [Authorize]
    public async Task<IActionResult> CharacterConfig(
        [FromRoute] int characterId,
        [FromBody] ApiCharacterConfigurationForm form
    )
    {
        var foundUser = await _userManager.GetUserAsync(User);
        if (foundUser == null)
        {
            _logger.LogWarning("Failed to find user");
            return Forbid();
        }

        var character = await _context.PlayerCharacter
            .Include(pc => pc.Configuration)
            .Where(pc => pc.Account.UserId == foundUser.Id && pc.Id == characterId)
            .FirstOrDefaultAsync();
        if (character == null)
        {
            _logger.LogWarning("User {0} trying to access character {1}", foundUser.Id, characterId);
            return Forbid();
        }

        if (character.Configuration == null)
        {
            character.Configuration = new PlayerCharacterConfiguration
            {
                CharacterId = character.Id,
            };
            _context.Add(character.Configuration);
        }

        character.Configuration.BackgroundBrightness = form.BackgroundBrightness;
        character.Configuration.BackgroundId = form.BackgroundId;
        character.Configuration.BackgroundSaturation = form.BackgroundSaturation;

        await _context.SaveChangesAsync();
        await _cacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, foundUser.Id);

        return Ok();
    }
}
