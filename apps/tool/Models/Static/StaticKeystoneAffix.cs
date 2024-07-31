namespace Wowthing.Tool.Models.Static;

public class StaticKeystoneAffix
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }

    public StaticKeystoneAffix(int id, string name)
    {
        Id = id;
        Name = name;
        Slug = name.Slugify();
    }
}
