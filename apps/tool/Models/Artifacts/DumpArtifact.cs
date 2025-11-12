using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Artifacts;

public class DumpArtifact
{
    public int ID { get; set; }

    public int ArtifactCategoryID { get; set; }
    public int ChrSpecializationID { get; set; }
    public int UiBarBackgroundColor { get; set; }
    public int UiBarOverlayColor { get; set; }
    public int UiNameColor { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
