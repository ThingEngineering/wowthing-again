using Wowthing.Lib.Models;
using Wowthing.Web.Services;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers;

public class AuctionsController : Controller
{
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly UserService _userService;

    public AuctionsController(
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        UserService userService
    )
    {
        _jsonSerializerOptions = jsonSerializerOptions;
        _memoryCacheService = memoryCacheService;
        _userService = userService;
    }

    [HttpGet("auctions")]
    public async Task<IActionResult> Index()
    {
        var hashes = await _memoryCacheService.GetCachedHashes();

        var apiResult = await _userService.CheckUser(User, User.Identity?.Name ?? "");
        var settings = new ApplicationUserSettings();
        string settingsJson = JsonSerializer.Serialize(settings, _jsonSerializerOptions);

        return View(new AuctionsViewModel(hashes, settingsJson));
    }
}
