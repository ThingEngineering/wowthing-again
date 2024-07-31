using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Quests;

// ReSharper disable InconsistentNaming
public class DumpQuestInfo
{
    public short ID { get; set; }
    public short Modifiers { get; set; }
    public short Profession { get; set; }
    public short Type { get; set; }

    [Name("InfoName_lang")]
    public string Name { get; set; } = string.Empty;
}
