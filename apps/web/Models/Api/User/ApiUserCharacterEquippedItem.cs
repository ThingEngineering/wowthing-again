using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserCharacterEquippedItem
{
    public int Context { get; set; }
    public int CraftedQuality { get; set; }
    public int ItemId { get; set; }
    public int ItemLevel { get; set; }
    public WowQuality Quality { get; set; }

    public List<int> BonusIds { get; set; }
    public List<int> EnchantmentIds { get; set; }
    public List<int> GemIds { get; set; }

    public ApiUserCharacterEquippedItem(PlayerCharacterEquippedItem equippedItem)
    {
        Context = equippedItem.Context;
        CraftedQuality = equippedItem.CraftedQuality;
        ItemId = equippedItem.ItemId;
        ItemLevel = equippedItem.ItemLevel;
        Quality = equippedItem.Quality;

        BonusIds = equippedItem.BonusIds;
        EnchantmentIds = equippedItem.EnchantmentIds;
        GemIds = equippedItem.GemIds;
    }
}
