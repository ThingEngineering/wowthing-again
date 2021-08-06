using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterEquipmentJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/equipment";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var uri = GenerateUri(query, ApiPath);
            var result = await GetJson<ApiCharacterEquipment>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var equipped = await Context.PlayerCharacterEquippedItems.FindAsync(query.CharacterId);
            if (equipped == null)
            {
                equipped = new PlayerCharacterEquippedItems
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterEquippedItems.Add(equipped);
            }

            equipped.Items = result.Data.Items
                .EmptyIfNull()
                .ToDictionary(
                    item => item.Slot.EnumParse<WowInventorySlot>(),
                    item => new PlayerCharacterEquippedItem
                    {
                        Context = item.Context,
                        ItemId = item.Item.Id,
                        ItemLevel = item.Level.Value,
                        Quality = item.Quality.EnumParse<WowQuality>(),
                        BonusIds = item.BonusList
                            .EmptyIfNull()
                            .OrderBy(b => b)
                            .ToList(),
                        EnchantmentIds = item.Enchantments
                            .EmptyIfNull()
                            .Where(e => e.Slot.Type == "PERMANENT")
                            .Select(e => e.Id)
                            .OrderBy(e => e)
                            .ToList(),
                        GemIds = item.Sockets
                            .EmptyIfNull()
                            .Where(s => s.Item != null)
                            .Select(s => s.Item.Id)
                            .OrderBy(g => g)
                            .ToList(),
                    }
                );

            await Context.SaveChangesAsync();
        }
    }
}
