using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Cache;

public class ItemBonusCache
{
    public readonly Dictionary<int, WowItemBonus> ById = new();
    public readonly Dictionary<WowItemBonusType, Dictionary<int, WowItemBonus>> ByType = new();

    public ItemBonusCache(WowItemBonus[] itemBonuses)
    {
        foreach (var bonusType in Enum.GetValues<WowItemBonusType>())
        {
            ByType[bonusType] = new();
        }

        foreach (var itemBonus in itemBonuses)
        {
            ById[itemBonus.Id] = itemBonus;

            foreach (var bonus in itemBonus.Bonuses)
            {
                var bonusType = (WowItemBonusType)bonus[0];
                ByType[bonusType][itemBonus.Id] = itemBonus;
            }
        }
    }
}
