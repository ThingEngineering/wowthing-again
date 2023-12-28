using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Professions;

// ReSharper disable InconsistentNaming
public class DumpModifiedCraftingCategory
{
    public int ID { get; set; }

    [Name("DisplayName_lang")]
    public string DisplayName { get; set; } = string.Empty;
}
