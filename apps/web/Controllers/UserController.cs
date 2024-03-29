﻿using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers;

public class UserController : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly UriService _uriService;
    private readonly UserService _userService;

    public UserController(
        ILogger<UserController> logger,
        UriService uriService,
        UserService userService
    )
    {
        _logger = logger;
        _uriService = uriService;
        _userService = userService;
    }

    [HttpGet("user/{username:username}")]
    public async Task<IActionResult> Index([FromRoute] string username)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        timer.AddPoint("user");

        var expectedUri = await _uriService.GetUriForUser(user: apiResult.User);
        var actualUri = HttpContext.Request.GetEncodedUrl();
        if (actualUri != expectedUri)
        {
            //Console.WriteLine("expected: {0} | actual: {1}", expectedUri, actualUri);
            return Redirect(expectedUri);
        }

        timer.AddPoint("uri");

        var viewModel = await _userService.CreateViewModel(User, apiResult);
        timer.AddPoint("viewmodel", true);

        _logger.LogDebug("{Timer}", timer);

        return View(viewModel);
    }
}
