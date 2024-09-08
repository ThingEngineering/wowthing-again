using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Quests;

// ReSharper disable InconsistentNaming
public class DumpQuestLine
{
    public int ID { get; set; }
    public int Flags { get; set; }
    public int QuestID { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
