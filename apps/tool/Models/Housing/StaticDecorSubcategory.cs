namespace Wowthing.Tool.Models.Housing;

public class StaticDecorSubcategory
{
    public short Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public List<StaticDecorObject> Decors { get; set; } = [];
}
