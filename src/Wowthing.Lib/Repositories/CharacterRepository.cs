using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Z.EntityFramework.Plus;

namespace Wowthing.Lib.Repositories
{
    public class CharacterRepository : RepositoryBase
    {
        public CharacterRepository(WowDbContext context) : base(context)
        {
        }

        public async Task<WowCharacter[]> GetCharactersByIds(IEnumerable<long> ids)
        {
            return await _context.WowCharacter
                .Where(c => ids.Contains(c.Id))
                .ToArrayAsync();
        }

        public async Task<List<WowCharacter>> GetCharactersByUserId(long userId)
        {
            return await _context.WowCharacter
                .Where(c => c.Account.UserId == userId)
                .ToListAsync();
        }

        public void AddCharacters(IEnumerable<WowCharacter> characters)
        {
            _context.WowCharacter.AddRange(characters);
        }

        public async Task OrphanCharacters(IEnumerable<long> accountIds, IEnumerable<long> characterIds)
        {
            await _context.WowCharacter
                .Where(c => accountIds.Contains(c.AccountId.Value) && !characterIds.Contains(c.Id))
                .UpdateAsync(c => new WowCharacter() { Account = null });
        }
    }
}
