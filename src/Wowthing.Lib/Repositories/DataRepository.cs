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

        public void AddClass(WowClass cls) => _context.WowClass.Add(cls);

        public void AddClasses(IEnumerable<WowClass> classes) => _context.WowClass.AddRange(classes);
        
        public async Task<WowClass[]> GetAllClasses() => await _context.WowClass.ToArrayAsync();
        
        public async Task<WowClass> GetClassById(int classId)
        {
            return await _context.WowClass
                .Where(c => c.Id == classId)
                .FirstOrDefaultAsync();
        }

        public void AddRaces(IEnumerable<WowRace> races) => _context.WowRace.AddRange(races);
        
        public async Task<WowRace[]> GetAllRaces() => await _context.WowRace.ToArrayAsync();
    }
}
