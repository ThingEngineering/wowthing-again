namespace Wowthing.Tool.Models.Collections;

public class DataCollectionCategory : ICloneable, IDataCategory
{
    public string Name { get; set; } = string.Empty;
    public List<DataCollectionGroup>? Groups { get; set; }

    public object Clone()
    {
        return new DataCollectionCategory
        {
            Name = (string)Name.Clone(),
            Groups = Groups,
        };
    }
}
