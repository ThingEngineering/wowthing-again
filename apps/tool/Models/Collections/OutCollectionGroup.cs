namespace Wowthing.Tool.Models.Collections;

public class OutCollectionGroup
{
    public string Name { get; set; }
    public List<int[]> Things { get; set; }

    public OutCollectionGroup(DataCollectionGroup group) : this(group.Name, group.Things)
    {
    }

    public OutCollectionGroup(string name, List<string>? things)
    {
        Name = name;
        Things = things
            .EmptyIfNull()
            .Select(t =>
                t.Trim()
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => int.Parse(s))
                    .ToArray())
            .ToList();
    }
}
