﻿using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Controllers;

[Authorize(Roles = "Admin")]
[Route("admin")]
public class AdminController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly WowDbContext _context;

    public AdminController(
        UserManager<ApplicationUser> userManager,
        WowDbContext context
    )
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        return View();
    }

    [HttpGet("rename-requests")]
    public async Task<IActionResult> GetRenameRequests()
    {
        var users = await _context.ApplicationUser
            .Where(user => user.Settings.General.DesiredAccountName != null)
            .Where(user => user.Settings.General.DesiredAccountName != "")
            .Where(user => user.Settings.General.DesiredAccountName != user.UserName)
            .Where(user => user.Settings.General.DesiredAccountName != "DENIED")
            .Select(user => new
            {
                user.Id,
                user.UserName,
                DesiredAccountName = SafeUserName(user.Settings.General.DesiredAccountName),
            })
            .ToArrayAsync();

        return Json(users);
    }

    [HttpPost("rename-requests/approve/{userId:long}")]
    public async Task<IActionResult> ApproveRenameRequest([FromRoute] long userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user?.Settings.General == null)
        {
            return NotFound();
        }

        await _userManager.SetUserNameAsync(user, SafeUserName(user.Settings.General.DesiredAccountName));

        user.Settings.General.DesiredAccountName = "";
        await _userManager.UpdateAsync(user);

        return Ok();
    }

    [HttpPost("rename-requests/decline/{userId:long}")]
    public async Task<IActionResult> DeclineRenameRequest([FromRoute] long userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user?.Settings.General == null)
        {
            return NotFound();
        }

        user.Settings.General.DesiredAccountName = "DENIED";
        await _userManager.UpdateAsync(user);

        return Ok();
    }

    private static string SafeUserName(string userName)
    {
        return Regex.Replace(userName, "[ \"'!@#$%^&*()/\\.]", "");
    }
}
