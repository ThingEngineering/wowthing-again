using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Items;

namespace Wowthing.Tool.Models.Items;

[JsonConverter(typeof(RedisItemDataConverter))]
public class RedisItemData : WowItem
{
    public string Name { get; set; } = string.Empty;
    public WowItemModifiedAppearance[]? Appearances { get; set; }

    public RedisItemData(WowItem item) : base(item.Id)
    {
        ClassMask = item.GetCalculatedClassMask();
        RaceMask = item.RaceMask;
        Stackable = item.Stackable;
        ClassId = item.ClassId;
        SubclassId = item.SubclassId;
        InventoryType = item.InventoryType;
        ContainerSlots = item.ContainerSlots;
        Quality = item.Quality;
        PrimaryStat = item.PrimaryStat;
        Flags = item.Flags;
        Expansion = item.Expansion;
        ItemLevel = item.ItemLevel;
        RequiredLevel = item.RequiredLevel;
        BindType = item.BindType;
    }
}
