using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticTransmogSetConverter))]
public class StaticTransmogSet : WowTransmogSet
{
    public List<List<int>> Items { get; set; }
    public string Name { get; set; }

    public StaticTransmogSet(WowTransmogSet transmogSet, Dictionary<int, WowItemModifiedAppearance> imaMap) : base(transmogSet.Id)
    {
        ClassMask = transmogSet.ClassMask;
        Flags = transmogSet.Flags;
        GroupId = transmogSet.GroupId;
        // ItemModifiedAppearanceIds = transmogSet.ItemModifiedAppearanceIds;
        ItemNameDescriptionId = transmogSet.ItemNameDescriptionId;

        Items = new();
        foreach (int imaId in transmogSet.ItemModifiedAppearanceIds)
        {
            if (imaMap.TryGetValue(imaId, out var ima))
            {
                Items.Add(new List<int>
                {
                    ima.ItemId,
                    ima.Modifier,
                });
            }
        }
    }
}
