namespace Wowthing.Backend.Models.Data.Collections;

public class DataCollectionCategory : ICloneable, IDataCategory
{
    public string Name { get; set; }
    public List<DataCollectionGroup> Groups { get; set; } = new();

    public object Clone()
    {
        return new DataCollectionCategory
        {
            Name = (string)Name.Clone(),
            Groups = Groups,
        };
    }
}