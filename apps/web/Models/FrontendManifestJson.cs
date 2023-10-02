namespace Wowthing.Web.Models;

public class FrontendManifestJson
{
    public bool IsEntry { get; set; }
    public string File { get; set; }
    public string Src { get; set; }
    public string[] Css { get; set; }
    public string[] Imports { get; set; }
}
