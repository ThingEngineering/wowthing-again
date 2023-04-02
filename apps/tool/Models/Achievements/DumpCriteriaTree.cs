using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Achievements;

public class DumpCriteriaTree
{
    public int Amount { get; set; }
    public int CriteriaID { get; set; }
    public int Flags { get; set; }
    public int ID { get; set; }
    public int Operator { get; set; }
    public int OrderIndex { get; set; }
    public int Parent { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;

    public List<DumpCriteriaTree> Children { get; set; } = new();
}
