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

    public Dictionary<string, PlayerCharacterAddonQuestsProgress> RawProgressQuests { get; set; }

    public ApiUserQuestsCharacter(PlayerCharacterAddonQuests addonQuests, List<int> quests)
    {
        {
            ScannedAt = addonQuests?.QuestsScannedAt ?? MiscConstants.DefaultDateTime;
            Dailies = addonQuests?.Dailies.EmptyIfNull();
            DailyQuestList = addonQuests?.DailyQuests ?? new List<int>();
            RawProgressQuests = addonQuests?.ProgressQuests.EmptyIfNull();
            QuestList = quests;
        }
    }
}
