using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Wowthing.Lib.Models;
using Wowthing.Lib.Services;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Services;

public class UserService
{
    private readonly CacheService _cacheService;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public UserService(
        CacheService cacheService,
        JsonSerializerOptions jsonSerializerOptions
    )
    {
        _cacheService = cacheService;
        _jsonSerializerOptions = jsonSerializerOptions;
    }

    public async Task<ApiUserResult> CheckUser(ClaimsPrincipal currentUser, string username)
    {
        var ret = new ApiUserResult();

        var foundUser = await _cacheService.FindUserByNameAsync(username);
        if (foundUser == null)
        {
            ret.NotFound = true;
            return ret;
        }

        ret.Public = currentUser.Identity?.Name != foundUser.UserName;
        ret.Privacy = foundUser.Settings?.Privacy ?? new ApplicationUserSettingsPrivacy();

        if (ret.Public && ret.Privacy.Public != true)
        {
            ret.NotFound = true;
            return ret;
        }

        ret.User = foundUser;
        return ret;
    }

    public async Task<UserViewModel> CreateViewModel(ClaimsPrincipal claimsPrincipal, ApplicationUser user)
    {
        var hashes = await _cacheService.GetCachedHashes();

        var settings = user.Settings ?? new ApplicationUserSettings();
        settings.Migrate();
        var settingsJson = System.Text.Json.JsonSerializer.Serialize(settings, _jsonSerializerOptions);

        return new UserViewModel(
            hashes,
            user,
            settings,
            settingsJson,
            claimsPrincipal?.Identity?.Name == user.UserName
        );
    }
}
