using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Lib.Contexts;

namespace Wowthing.Lib.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly WowDbContext _context;

        public UserRepository(WowDbContext context)
        {
            _context = context;
        }

        public async Task<string> GetAccessTokenByUserId(long userId)
        {
            return await _context.UserTokens
                .Where(t => t.UserId == userId && t.LoginProvider == "BattleNet" && t.Name == "access_token")
                .Select(t => t.Value)
                .FirstOrDefaultAsync();
        }
    }
}
