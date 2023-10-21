using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Web.Models;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers.API;

public class UploadController : Controller
{
    private readonly ILogger<UploadController> _logger;
    private readonly UploadService _uploadService;
    private readonly WowDbContext _context;

    public UploadController(
        ILogger<UploadController> logger,
        UploadService uploadService,
        WowDbContext context
    )
    {
        _logger = logger;
        _uploadService = uploadService;
        _context = context;
    }

    [HttpPost("api/upload")]
    public async Task<IActionResult> Upload([FromBody] ApiUpload apiUpload)
    {
        // TODO rate limit
        if (apiUpload?.ApiKey == null || apiUpload.LuaFile == null)
        {
            _logger.LogWarning("Invalid request format");
            _logger.LogDebug("Upload: {0}", JsonConvert.SerializeObject(apiUpload));
            return BadRequest("Invalid request format");
        }

        if (apiUpload.ApiKey.Length != ApplicationUser.ApiKeyLength * 2)
        {
            _logger.LogWarning(("Invalid API key format"));
            return BadRequest("Invalid API key format");
        }

        var user = await _context.ApplicationUser
            .Where(u => u.ApiKey == apiUpload.ApiKey)
            .FirstOrDefaultAsync();
        if (user == null)
        {
            _logger.LogWarning("Invalid API key");
            return StatusCode((int) HttpStatusCode.Forbidden, "Invalid API key");
        }

        await _uploadService.Process(user.Id, apiUpload.LuaFile);

        _logger.LogInformation("Accepted upload for user {userId}, {length} bytes",
            user.Id, apiUpload.LuaFile.Length);

        return Ok("Upload accepted");
    }
}
