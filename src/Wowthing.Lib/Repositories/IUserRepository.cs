using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Lib.Repositories
{
    public interface IUserRepository
    {
        Task<string> GetAccessTokenByUserId(long userId);
    }
}
