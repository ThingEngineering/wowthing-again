using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Artifacts;

public class DumpArtifactAppearance
{
    public int ID { get; set; }

    public int ArtifactAppearanceSetID { get; set; }
    public int DisplayIndex { get; set; }
    public int ItemAppearanceModifierID { get; set; }
    public int UiSwatchColor { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
