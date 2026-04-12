using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Cache;

public class ItemModifiedAppearanceCache
{
    public readonly Dictionary<int, ItemModifiedAppearance> ById = new();
    public readonly Dictionary<(int, short), ItemModifiedAppearance> ByItemIdAndModifier = new();
    public readonly Dictionary<int, short[]> ModifiersByItemId;

    public ItemModifiedAppearanceCache(WowItemModifiedAppearance[] itemModifiedAppearances)
    {
        var tempModifiers = new Dictionary<int, HashSet<short>>();

        foreach (var ima in itemModifiedAppearances)
        {
            var record = new ItemModifiedAppearance(
                ima.AppearanceId,
                ima.ItemId,
                ima.Modifier,
                ima.SourceType != TransmogSourceType.CantCollect &&
                ima.SourceType != TransmogSourceType.NotValidForTransmog
            );
            ById[ima.Id] = record;
            ByItemIdAndModifier[(ima.ItemId, ima.Modifier)] = record;

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

    public record ItemModifiedAppearance(int AppearanceId, int ItemId, short Modifier, bool Collectable);
}
