using Wowthing.Tool.Converters.Static;
using Wowthing.Tool.Models.Quests;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticQuestInfoConverter))]
public class StaticQuestInfo
{
    public short Id { get; set; }
    public short Flags { get; set; }
    public short ProfessionId { get; set; }
    public short Type { get; set; }
    public string Name { get; set; }

    public StaticQuestInfo(DumpQuestInfo qi)
    {
        Id = qi.ID;
        Flags = qi.Modifiers;
        ProfessionId = qi.Profession;
        Type = qi.Type;
        Name = qi.Name;
    }
}
