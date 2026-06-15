using System.Net.Mime;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers.API;

public class DynamicDataController : Controller
{
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly WowDbContext _context;

    public DynamicDataController(
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        WowDbContext context
    )
    {
        _jsonSerializerOptions = jsonSerializerOptions;
        _memoryCacheService = memoryCacheService;
        _context = context;
    }

    [HttpGet("api/dynamic-data/{region:int}")]
    public async Task<IActionResult> Active([FromRoute] int region)
    {
        if (!Enum.IsDefined(typeof(WowRegion), region))
        {
            return BadRequest();
        }

        var result = await _memoryCacheService.GetDynamicDataForRegion((short)(region & 0x7FFF));
        string json = JsonSerializer.Serialize(result, _jsonSerializerOptions);
        return Content(json, MediaTypeNames.Application.Json);
    }
}
