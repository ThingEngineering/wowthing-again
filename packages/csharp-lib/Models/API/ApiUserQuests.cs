using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Models.API;

public class ApiUserQuests
{
    public int[] Account { get; set; }
    public Dictionary<int, ApiUserQuestsCharacter> Characters { get; set; }
}

public class ApiUserQuestsCharacter
{
    public DateTime ScannedAt { get; set; }

    public Dictionary<int, List<List<int>>> Dailies { get; set; }
    public List<int> DailyQuestList { get; set; }
    public List<int> QuestList { get; set; } = new();

    public Dictionary<string, PlayerCharacterAddonQuestsProgress> ProgressQuests { get; set; }

    public ApiUserQuestsCharacter(PlayerCharacterAddonQuests addonQuests, PlayerCharacterQuests quests)
    {
        {
            ScannedAt = addonQuests?.QuestsScannedAt ?? MiscConstants.DefaultDateTime;
            Dailies = addonQuests?.Dailies.EmptyIfNull();
            DailyQuestList = addonQuests?.DailyQuests ?? new List<int>();
            ProgressQuests = addonQuests?.ProgressQuests.EmptyIfNull();

            int[] distinctQuestIds = (quests?.CompletedIds ?? new List<int>())
                .Union(addonQuests?.OtherQuests ?? new List<int>())
                .Distinct()
                .Order()
                .ToArray();

            int lastQuestId = 0;
            foreach (int questId in distinctQuestIds)
            {
                QuestList.Add(questId - lastQuestId);
                lastQuestId = questId;
            }
        }
    }
}
