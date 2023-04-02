using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Achievements;

public class DumpAchievementCategory
{
    public int ID { get; set; }
    public int Parent { get; set; }

    [Name("Ui_order")]
    public int UiOrder { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
