using System.Text.Json;
using Wowthing.Lib.Contexts;
using Wowthing.Web.Services;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers;

public class AuctionsController : Controller
{
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly WowDbContext _context;

    public AuctionsController(
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        WowDbContext context)
    {
        _jsonSerializerOptions = jsonSerializerOptions;
        _memoryCacheService = memoryCacheService;
        _context = context;
    }

    [HttpGet("auctions")]
    public async Task<IActionResult> Index()
    {
        var hashes = await _memoryCacheService.GetCachedHashes();

        return View(new AuctionsViewModel(hashes));
    }
}
