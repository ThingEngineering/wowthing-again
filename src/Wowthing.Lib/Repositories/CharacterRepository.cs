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
    public class CharacterRepository
    {
        private readonly WowDbContext _context;

        public CharacterRepository(WowDbContext context)
        {
            _context = context;
        }

        public async Task<List<WowCharacter>> GetCharactersByUserId(long userId)
        {
            return await _context.WowCharacter
                .Where(c => c.Account.UserId == userId)
                .ToListAsync();
        }

        public async Task AddCharacters(IEnumerable<WowCharacter> characters)
        {
            if (characters.Count() == 0)
            {
                return;
            }

            _context.WowCharacter.AddRange(characters);
            await _context.SaveChangesAsync();
        }
    }
}
