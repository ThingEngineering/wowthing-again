using Wowthing.Tool.Converters.Professions;

namespace Wowthing.Tool.Models.Professions;

[JsonConverter(typeof(OutProfessionConverter))]
public class OutProfession
{
    public int Id { get; set; }
    public int Type { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public List<OutProfessionCategory> Categories { get; set; } = new();
    public List<OutSubProfession> SubProfessions { get; set; } = new();
}
