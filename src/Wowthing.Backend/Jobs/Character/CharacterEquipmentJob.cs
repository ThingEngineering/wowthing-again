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

            var result = await GetJson<ApiCharacterEquipment>(uri, useLastModified: false);
            if (result.NotModified)
            {
                _logger.Information("304 Not Modified");
                return;
            }

            // Fetch character data
            var equippedBySlot = await _context.PlayerCharacterEquippedItem
                .Where(ei => ei.CharacterId == query.CharacterId)
                .ToDictionaryAsync(k => k.InventorySlot);
            var seenSlots = new HashSet<WowInventorySlot>();

            foreach (var item in result.Data.Items)
            {
                var slot = item.Slot.EnumParse<WowInventorySlot>();
                seenSlots.Add(slot);

                if (!equippedBySlot.TryGetValue(slot, out var equippedItem))
                {
                    equippedItem = new PlayerCharacterEquippedItem
                    {
                        CharacterId = query.CharacterId,
                        InventorySlot = slot,
                    };
                    _context.Add(equippedItem);
                }

                equippedItem.Context = item.Context;
                equippedItem.ItemId = item.Item.Id;
                equippedItem.ItemLevel = item.Level.Value;
                equippedItem.Quality = item.Quality.EnumParse<WowQuality>();

                if (item.BonusList != null)
                {
                    equippedItem.BonusIds = item.BonusList.OrderBy(b => b).ToList();
                }
                else
                {
                    equippedItem.BonusIds = new List<int>();
                } 

                if (item.Enchantments != null)
                {
                    equippedItem.EnchantmentIds = item.Enchantments.Select(e => e.Id).OrderBy(e => e).ToList();
                }
                else
                {
                    equippedItem.EnchantmentIds = new List<int>();
                } 
            }

            await _context.SaveChangesAsync();

            await _context.PlayerCharacterEquippedItem
                .Where(ei => ei.CharacterId == query.CharacterId && !seenSlots.Contains(ei.InventorySlot))
                .DeleteAsync();
        }
    }
}
