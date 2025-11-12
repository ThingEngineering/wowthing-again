namespace Wowthing.Tool.Models.Static;

public class StaticArtifact
{
    public int ChrSpecializationId { get; }
    public int Id { get; }
    public string Name { get; }
    public List<StaticArtifactAppearanceSet> AppearanceSets { get; } = [];

    public StaticArtifact(int id, int chrSpecializationId, string name)
    {
        Id = id;
        ChrSpecializationId = chrSpecializationId;
        Name = name;
    }
}

public class StaticArtifactAppearanceSet
{
    public string Name { get; }
    public List<StaticArtifactAppearance> Appearances { get; } = [];

    public StaticArtifactAppearanceSet(string name)
    {
        Name = name;
    }
}

public class StaticArtifactAppearance
{
    public int AppearanceModifier { get; }
    public int Id { get; }
    public string Name { get; }
    public string SwatchColor { get; private set; }

    public StaticArtifactAppearance(int id, int appearanceModifier, int swatchColor, string name)
    {
        Id = id;
        AppearanceModifier = appearanceModifier;
        Name = name;

        // Convert the ARGB signed int32 to an RGBA hex string
        string argb = (swatchColor >>> 0).ToString("X8");
        SwatchColor = $"{argb[2..]}{argb[..2]}";
    }
}
