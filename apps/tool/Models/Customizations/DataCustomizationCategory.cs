namespace Wowthing.Tool.Models.Customizations;

public class DataCustomizationCategory : ICloneable, IDataCategory
{
    public string Name { get; set; } = string.Empty;
    public List<DataCustomizationGroup>? Groups { get; set; }

    public object Clone()
    {
        return new DataCustomizationCategory
        {
            Name = (string)Name.Clone(),
            // We don't have to change these, reference is fine
            Groups = Groups,
        };
    }
}
