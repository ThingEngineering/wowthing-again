using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpChrClasses
{
    public short ID { get; set; }
    public short ArmorTypeMask { get; set; }
    public short RolesMask { get; set; }

    [Name("Name_female_lang")]
    public string FemaleName { get; set; } = string.Empty;

    [Name("Name_male_lang")]
    public string MaleName { get; set; } = string.Empty;
}
