using Wowthing.Web.Services;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers;

public class AuctionsController : Controller
{
    private readonly MemoryCacheService _memoryCacheService;

    public AuctionsController(MemoryCacheService memoryCacheService)
    {
        _memoryCacheService = memoryCacheService;
    }

    [HttpGet("auctions")]
    public async Task<IActionResult> Index()
    {
        var hashes = await _memoryCacheService.GetCachedHashes();

        return View(new AuctionsViewModel(hashes));
    }
}
