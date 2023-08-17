namespace Wowthing.Tool.Models.Vendors;

public class ManualVendorItem
{
    public int ClassMask { get; set; }
    public int Id { get; set; }
    public string Note { get; set; }
    public string Reputation { get; set; }
    public int SubType { get; set; }
    public WowQuality Quality { get; set; }
    public RewardType Type { get; set; }
    public Dictionary<int, int> Costs { get; set; }

    public int[] AppearanceIds { get; set; }
    public int[] BonusIds { get; set; }

    public ManualVendorItem()
    {}

    public ManualVendorItem(DataVendorItem item)
    {
        Id = item.Id;
        Note = item.Note;
        Reputation = item.Reputation;
        Type = Enum.Parse<RewardType>(item.Type, true);
        Costs = item.Costs;

        if (!string.IsNullOrWhiteSpace(item.AppearanceId))
        {
            AppearanceIds = item.AppearanceId.Split(' ').Select(int.Parse).ToArray();
        }

        if (!string.IsNullOrWhiteSpace(item.Quality))
        {
            Quality = Enum.Parse<WowQuality>(item.Quality, true);
        }

        if (!string.IsNullOrWhiteSpace(item.BonusIds))
        {
            BonusIds = item.BonusIds
                .Split(' ')
                .Select(int.Parse)
                .ToArray();
        }
    }
}
