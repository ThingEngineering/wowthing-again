namespace Wowthing.Tool.Models.Covenants;

public class OutSoulbind
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int[]? Renown { get; set; }
    public List<List<List<int>>> Rows { get; set; } = new();
}
