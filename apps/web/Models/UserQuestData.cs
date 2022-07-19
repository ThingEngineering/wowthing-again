using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models;

public class UserQuestData
{
    public Dictionary<int, UserQuestDataCharacter> Characters { get; set; }
}

public class UserQuestDataCharacter
{
    public DateTime ScannedAt { get; set; }
        
    public Dictionary<int, List<List<int>>> Dailies { get; set; }
    public List<int> DailyQuestList { get; set; }
    public List<int> QuestList { get; set; }
        
    public Dictionary<string, PlayerCharacterAddonQuestsProgress> ProgressQuests { get; set; }
}