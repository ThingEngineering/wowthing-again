using Wowthing.Tool.Models.Traits;

namespace Wowthing.Tool.Models.Professions;

public class OutSubProfession
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<OutTraitTree>? TraitTrees { get; set; }
}
