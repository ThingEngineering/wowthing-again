using Microsoft.AspNetCore.Authorization;

namespace Wowthing.Web.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    [HttpGet("admin")]
    public async Task<IActionResult> Index()
    {
        return View();
    }
}
