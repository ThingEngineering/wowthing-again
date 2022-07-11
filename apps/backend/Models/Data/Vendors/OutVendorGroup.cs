using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Data.Vendors
{
    public class OutVendorGroup
    {
        public string Name { get; set; }
        public RewardType Type { get; set; }
        public List<OutVendorItem> Things { get; set; }

        public OutVendorGroup(DataVendorGroup group)
        {
            Name = group.Name;
            Type = Enum.Parse<RewardType>(group.Type, true);
            Things = group.Things
                .EmptyIfNull()
                .Select(item => new OutVendorItem(item))
                .ToList();
        }
    }
}
