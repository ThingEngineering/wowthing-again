namespace Wowthing.Backend.Models.Data.Collections;

public class OutCollectionGroup
{
    public string Name { get; set; }
    public List<int[]> Things { get; set; }

    public OutCollectionGroup(DataCollectionGroup group)
        : this(group.Name, group.Things)
    {
    }
        
    public OutCollectionGroup(string name, ICollection<string> things)
    {
        Name = name;
        Things = things
            .Select(t =>
                t.Trim()
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => int.Parse(s))
                    .ToArray())
            .ToList();
    }
}