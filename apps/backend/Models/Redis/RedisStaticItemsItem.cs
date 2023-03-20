using Wowthing.Backend.Converters;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Redis;

[JsonConverter(typeof(RedisStaticItemsItemConverter))]
public class RedisStaticItemsItem : WowItem
{
    public string Name { get; set; }
    public WowItemModifiedAppearance[] Appearances { get; set; }

    public RedisStaticItemsItem(WowItem item) : base(item.Id)
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
    }
}
