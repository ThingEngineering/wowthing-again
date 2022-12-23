using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Professions;

public class DumpCraftingData
{
    public int CraftedItemID { get; set; }
    public int CraftingDifficulty { get; set; }
    public int CraftingDifficultyID { get; set; }
    public int FirstCraftFlagQuestID { get; set; }
    public int ID { get; set; }
    public int ItemBonusTreeID { get; set; }
}
