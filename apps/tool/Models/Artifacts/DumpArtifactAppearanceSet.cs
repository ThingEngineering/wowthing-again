using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Artifacts;

public class DumpArtifactAppearanceSet
{
    public int ID { get; set; }

    public int ArtifactID { get; set; }
    public int DisplayIndex { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
