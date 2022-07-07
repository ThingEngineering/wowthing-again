﻿using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterEquipmentJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/equipment";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]) ??
                        throw new InvalidJsonException(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            ApiCharacterEquipment resultData;
            var uri = GenerateUri(query, ApiPath);
            try
            {
                var result = await GetJson<ApiCharacterEquipment>(uri, useLastModified: false);
                if (result.NotModified)
                {
                    LogNotModified();
                    return;
                }

                resultData = result.Data;
            }
            catch (HttpRequestException e)
            {
                Logger.Error("HTTP {0}", e.Message);
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

            equipped.Items = resultData.Items
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

            int updated = await Context.SaveChangesAsync();
            if (updated > 0)
            {
                await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, query.UserId);
            }
        }
    }
}
