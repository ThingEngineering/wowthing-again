using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Wowthing.Lib.Contexts;

namespace Wowthing.Lib.Repositories
{
    public abstract class RepositoryBase
    {
        protected readonly WowDbContext _context;

        public RepositoryBase(WowDbContext context)
        {
            _context = context;
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
