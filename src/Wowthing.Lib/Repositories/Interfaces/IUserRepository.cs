using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Wowthing.Lib.Models;

namespace Wowthing.Lib.Repositories
{
    public interface IUserRepository
    {
        void AddAccounts(IEnumerable<WowAccount> accounts);
        Task<WowAccount[]> GetAccountsByIds(IEnumerable<long> ids);
        Task<WowAccount[]> GetAccountsByUserId(long userId);
        Task<string> GetAccessTokenByUserId(long userId);
    }
}
