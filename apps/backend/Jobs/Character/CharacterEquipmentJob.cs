using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterEquipmentJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/equipment";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterEquipment resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterEquipment>(uri, useLastModified: false);
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
        var equipped = await Context.PlayerCharacterEquippedItems.FindAsync(_query.CharacterId);
        if (equipped == null)
        {
            equipped = new PlayerCharacterEquippedItems
            {
                CharacterId = _query.CharacterId,
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

        await Context.SaveChangesAsync();
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
