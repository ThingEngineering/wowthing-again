using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Repositories
{
    public class UserRepository : RepositoryBase, IUserRepository
    {
        public UserRepository(WowDbContext context) : base(context)
        {
        }

        public async Task<string> GetAccessTokenByUserId(long userId)
        {
            return await _context.UserTokens
                .Where(t => t.UserId == userId && t.LoginProvider == "BattleNet" && t.Name == "access_token")
                .Select(t => t.Value)
                .FirstOrDefaultAsync();
        }

        public async Task<WowAccount[]> GetAccountsByIds(IEnumerable<long> ids)
        {
            return await _context.WowAccount
                .Where(a => ids.Contains(a.Id))
                .ToArrayAsync();
        }

        public async Task<WowAccount[]> GetAccountsByUserId(long userId)
        {
            return await _context.WowAccount
                .Where(a => a.UserId == userId)
                .ToArrayAsync();
        }

        public void AddAccounts(IEnumerable<WowAccount> accounts)
        {
            _context.WowAccount.AddRange(accounts);
        }
    }
}
