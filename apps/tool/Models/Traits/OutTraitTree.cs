namespace Wowthing.Tool.Models.Traits;

public class OutTraitTree
{
    public int Id { get; set; }
    public OutTraitNode FirstNode { get; set; }

    public OutTraitTree(int id)
    {
        Id = id;
    }
}
