using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticTransmogSetConverter))]
public class StaticTransmogSet : WowTransmogSet
{
    public Dictionary<int, List<int>> ItemsByModifier { get; } = new();
    public string Name { get; set; } = string.Empty;

    public StaticTransmogSet(WowTransmogSet transmogSet, Dictionary<int, WowItemModifiedAppearance> imaMap) : base(transmogSet.Id)
    {
        ClassMask = transmogSet.ClassMask;
        Flags = transmogSet.Flags;
        GroupId = transmogSet.GroupId;
        ItemNameDescriptionId = transmogSet.ItemNameDescriptionId;

        foreach (int imaId in transmogSet.ItemModifiedAppearanceIds)
        {
            // skip NotValidForTransmog sources
            if (imaMap.TryGetValue(imaId, out var ima) &&
                ima.SourceType != TransmogSourceType.NotValidForTransmog)
            {
                ItemsByModifier.TryAdd(ima.Modifier, []);
                ItemsByModifier[ima.Modifier].Add(ima.ItemId);
            }
        }
    }
}
