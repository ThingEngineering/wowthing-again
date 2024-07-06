namespace Wowthing.Tool.Models.Customizations;

public class ManualCustomizationGroup
{
    public string Name { get; }
    public List<ManualCustomizationThing> Things { get; }
    public HashSet<string> SeenNames { get; } = new();

    public ManualCustomizationGroup(string name)
    {
        Name = name;
        Things = new();
    }

    public ManualCustomizationGroup(DataCustomizationGroup dataGroup)
    {
        Name = dataGroup.Name;
        Things = dataGroup.Things
            .EmptyIfNull()
            .Select(thing => new ManualCustomizationThing(thing))
            .ToList();
    }
}
