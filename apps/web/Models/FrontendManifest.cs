namespace Wowthing.Web.Models;

public class FrontendManifest
{
    public Dictionary<string, FrontendManifestEntrypoint> Entrypoints { get; set; } = new();
}

public class FrontendManifestEntrypoint
{
    public readonly List<string> Css = new();
    public readonly List<string> Js = new();
}
