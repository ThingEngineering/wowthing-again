using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Professions;

public class DumpTradeSkillCategory
{
    public int ID { get; set; }
    public int OrderIndex { get; set; }
    public int ParentTradeSkillCategoryID { get; set; }
    public int SkillLineID { get; set; }

    [Name("Name_lang")]
    public string AllianceName { get; set; } = string.Empty;

    [Name("HordeName_lang")]
    public string HordeName { get; set; } = string.Empty;
}
