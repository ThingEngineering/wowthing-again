namespace Wowthing.Tool.Models.Professions;

public class OutProfession
{
    public int Id { get; set; }
    public int Type { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public List<OutSubProfession> SubProfessions { get; set; } = new();

    public List<OutProfessionCategory> RawCategories { get; set; } = new();
}
