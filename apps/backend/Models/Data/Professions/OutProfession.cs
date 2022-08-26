namespace Wowthing.Backend.Models.Data.Professions;

public class OutProfession
{
    public int Id { get; set; }
    public int Type { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public List<OutSubProfession> SubProfessions { get; set; }
}
