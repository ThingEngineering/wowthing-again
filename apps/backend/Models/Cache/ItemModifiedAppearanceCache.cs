using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Cache;

public class ItemModifiedAppearanceCache
{
    public readonly Dictionary<(int, short), int> ByItemIdAndModifier = new();

    public ItemModifiedAppearanceCache(WowItemModifiedAppearance[] itemModifiedAppearances)
    {
        foreach (var ima in itemModifiedAppearances)
        {
            ByItemIdAndModifier[(ima.ItemId, ima.Modifier)] = ima.AppearanceId;
        }
    }
}
