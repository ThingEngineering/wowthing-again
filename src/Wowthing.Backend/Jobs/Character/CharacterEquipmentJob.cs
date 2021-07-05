using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;
using Z.EntityFramework.Plus;

namespace Wowthing.Backend.Jobs.User
{
    public class CharacterEquipmentJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/equipment";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var path = string.Format(API_PATH, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterEquipment>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var equipped = await _context.PlayerCharacterEquippedItems.FindAsync(query.CharacterId);
            if (equipped == null)
            {
                equipped = new PlayerCharacterEquippedItems
                {
                    CharacterId = query.CharacterId,
                };
                _context.PlayerCharacterEquippedItems.Add(equipped);
            }

            equipped.Items = result.Data.Items
                .ToDictionary(
                    item => item.Slot.EnumParse<WowInventorySlot>(),
                    item => new PlayerCharacterEquippedItem
                    {
                        Context = item.Context,
                        ItemId = item.Item.Id,
                        ItemLevel = item.Level.Value,
                        Quality = item.Quality.EnumParse<WowQuality>(),
                        BonusIds = item.BonusList?.OrderBy(b => b).ToList() ?? new List<int>(),
                        EnchantmentIds = item.Enchantments?.Select(e => e.Id).OrderBy(e => e).ToList() ?? new List<int>(),
                    }
                );

            await _context.SaveChangesAsync();
        }
    }
}
