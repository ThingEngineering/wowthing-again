using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Cache;

public class ItemModifiedAppearanceCache
{
    public readonly Dictionary<int, (int, short)> IdToItemIdAndModifier = new();
    public readonly Dictionary<(int, short), int> ItemIdAndModifierToAppearanceId = new();
    public readonly Dictionary<int, short[]> ModifiersByItemId;

    public ItemModifiedAppearanceCache(WowItemModifiedAppearance[] itemModifiedAppearances)
    {
        var tempModifiers = new Dictionary<int, HashSet<short>>();

        foreach (var ima in itemModifiedAppearances)
        {
            IdToItemIdAndModifier[ima.Id] = (ima.ItemId, ima.Modifier);
            ItemIdAndModifierToAppearanceId[(ima.ItemId, ima.Modifier)] = ima.AppearanceId;

            if (!tempModifiers.TryGetValue(ima.ItemId, out var modifiers))
            {
                modifiers = tempModifiers[ima.ItemId] = [];
            }

            modifiers.Add(ima.Modifier);
        }

        ModifiersByItemId = tempModifiers
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Order().ToArray()
            );
    }
}
