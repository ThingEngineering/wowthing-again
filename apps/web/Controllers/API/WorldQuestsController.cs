using System.Net.Mime;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;

namespace Wowthing.Web.Controllers.API;

[Route("api/world-quests")]
public class WorldQuestsController : Controller
{
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly WowDbContext _context;

    public WorldQuestsController(
        JsonSerializerOptions jsonSerializerOptions,
        WowDbContext context
    )
    {
        _jsonSerializerOptions = jsonSerializerOptions;
        _context = context;
    }

    [HttpGet("active/{region:int}")]
    public async Task<IActionResult> Active([FromRoute] int region)
    {
        if (!Enum.IsDefined(typeof(WowRegion), region))
        {
            return BadRequest();
        }

        var results = await _context.WorldQuestAggregate
            .Where(wqa => wqa.Region == (short)(region & 0x7FFF))
            .ToArrayAsync();

        string json = JsonSerializer.Serialize(results, _jsonSerializerOptions);
        return Content(json, MediaTypeNames.Application.Json);
    }
}
