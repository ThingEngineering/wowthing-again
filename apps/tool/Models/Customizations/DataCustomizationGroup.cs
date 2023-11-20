namespace Wowthing.Tool.Models.Customizations;

public class DataCustomizationGroup
{
    public string Name { get; set; } = string.Empty;

    public List<DataCustomizationThing> Things { get; set; } = new();
}
