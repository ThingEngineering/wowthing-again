namespace Wowthing.Backend.Models.Data.TransmogSets;

public class DataTransmogSetCategory : ICloneable, IDataCategory
{
    public string Name { get; set; }
    public List<DataTransmogSetGroup> Groups { get; set; }

    public object Clone()
    {
        return new DataTransmogSetCategory
        {
            Name = (string)Name.Clone(),
            Groups = Groups,
        };
    }
}
