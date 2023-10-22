using Wowthing.Tool.Converters.Static;
using Wowthing.Tool.Models.Quests;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticQuestInfoConverter))]
public class StaticQuestInfo
{
    public short Id { get; set; }
    public short Type { get; set; }
    public short ProfessionId { get; set; }
    public string Name { get; set; }

    public StaticQuestInfo(DumpQuestInfo qi)
    {
        Id = qi.ID;
        Type = qi.Type;
        ProfessionId = qi.Profession;
        Name = qi.Name;
    }
}
