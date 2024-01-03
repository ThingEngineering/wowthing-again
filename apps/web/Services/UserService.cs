using System.Security.Claims;
using System.Text.Json;
using Wowthing.Lib.Models;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Services;

public class UserService
{
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly MemoryCacheService _memoryCacheService;

    public UserService(
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService
    )
    {
        _jsonSerializerOptions = jsonSerializerOptions;
        _memoryCacheService = memoryCacheService;
    }

    public async Task<ApiUserResult> CheckUser(ClaimsPrincipal currentUser, string username)
    {
        var ret = new ApiUserResult();

        var foundUser = await _memoryCacheService.FindUserByNameAsync(username);
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

    public async Task<UserViewModel> CreateViewModel(ClaimsPrincipal claimsPrincipal, ApiUserResult apiResult)
    {
        var hashes = await _memoryCacheService.GetCachedHashes();

        var settings = apiResult.User.Settings ?? new ApplicationUserSettings();
        settings.Migrate();
        string settingsJson = JsonSerializer.Serialize(settings, _jsonSerializerOptions);

        string modifiedJson = await _memoryCacheService.GetUserModifiedJsonAsync(apiResult);

        return new UserViewModel(
            hashes,
            apiResult.User,
            settings,
            modifiedJson,
            settingsJson,
            !apiResult.Public
        );
    }
}
