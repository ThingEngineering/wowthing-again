using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Models.API;

public class ApiUserQuests
{
    public Dictionary<int, ApiUserQuestsCharacter> Characters { get; set; }

}

public class ApiUserQuestsCharacter
{
    public DateTime ScannedAt { get; set; }

    public Dictionary<int, List<List<int>>> Dailies { get; set; }
    public List<int> DailyQuestList { get; set; }
    public List<int> QuestList { get; set; }

    public Dictionary<string, PlayerCharacterAddonQuestsProgress> ProgressQuests { get; set; }
}
