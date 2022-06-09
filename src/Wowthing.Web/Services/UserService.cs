using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Wowthing.Lib.Models;
using Wowthing.Web.Models;

namespace Wowthing.Web.Services;

public class UserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }
    
    public async Task<ApiUserResult> CheckUser(ClaimsPrincipal currentUser, string username)
    {
        var ret = new ApiUserResult();
            
        var foundUser = await _userManager.FindByNameAsync(username);
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
}
