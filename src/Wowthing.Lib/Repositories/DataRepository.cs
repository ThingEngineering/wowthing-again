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
    public class DataRepository : RepositoryBase
    {
        public DataRepository(WowDbContext context) : base(context)
        {
        }

        public async Task<List<WowRace>> GetAllRaces() => await _context.WowRace.ToListAsync();

        public void AddRaces(IEnumerable<WowRace> races)
        {
            _context.WowRace.AddRange(races);
        }
    }
}
