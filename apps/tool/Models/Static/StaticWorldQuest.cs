using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticWorldQuestConverter))]
public class StaticWorldQuest : WowWorldQuest
{
    public string Name { get; set; }

    public StaticWorldQuest(WowWorldQuest worldQuest) : base(worldQuest.Id)
    {
        Expansion = worldQuest.Expansion;
        Faction = worldQuest.Faction;
        MaxLevel = worldQuest.MaxLevel;
        MinLevel = worldQuest.MinLevel;
        QuestInfoId = worldQuest.QuestInfoId;
        NeedQuestIds = worldQuest.NeedQuestIds;
        SkipQuestIds = worldQuest.SkipQuestIds;
    }
}
