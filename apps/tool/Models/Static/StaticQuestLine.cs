using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticQuestLineConverter))]
public class StaticQuestLine : WowQuestLine
{
    public string Name { get; set; }

    public StaticQuestLine(WowQuestLine questLine) : base(questLine.Id)
    {
        Id = questLine.Id;
        QuestIds = questLine.QuestIds;
    }
}
