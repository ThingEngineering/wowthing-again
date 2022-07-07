using Microsoft.AspNetCore.Identity;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Extensions
{
    public static class UserManagerExtensions
    {
        public static async Task<ApplicationUser> FindByIdAsync(this UserManager<ApplicationUser> manager, long id)
        {
            return await manager.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
        }
    }
}
