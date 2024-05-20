namespace Wowthing.Tool.Models.Transmog;

public class ManualTransmogSet
{
    public int AchievementId { get; set; }
    public int QuestId { get; set; }
    public int TransmogSetId { get; set; }
    public int WowheadSetId { get; set; }
    public string Name { get; set; }
    public Dictionary<string, List<int>> Items { get; set; }

    public ManualTransmogSet(DataTransmogSet set)
    {
        AchievementId = set.AchievementId ?? 0;
        QuestId = set.QuestId ?? 0;
        TransmogSetId = set.TransmogSetId ?? 0;
        WowheadSetId = set.WowheadSetId ?? 0;
        Name = set.Name;

        Items = set.Items
            .EmptyIfNull()
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value
                    .Trim()
                    .Split()
                    .Select(int.Parse)
                    .ToList()
            );
    }
}
