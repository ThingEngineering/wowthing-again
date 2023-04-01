using Wowthing.Tool.Converters.Achievements;

namespace Wowthing.Tool.Models.Achievements;

[JsonConverter(typeof(OutCriteriaConverter))]
public class OutCriteria
{
    public int Asset { get; }
    public int Id { get; }
    public int ModifierTreeId { get; }
    public int Type { get; }

    public OutCriteria(DumpCriteria criteria)
    {
        Asset = criteria.Asset;
        Id = criteria.ID;
        ModifierTreeId = criteria.ModifierTreeID;
        Type = criteria.Type;
    }
}
