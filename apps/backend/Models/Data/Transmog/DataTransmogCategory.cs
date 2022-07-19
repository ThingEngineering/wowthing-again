namespace Wowthing.Backend.Models.Data.Transmog;

public class DataTransmogCategory : ICloneable, IDataCategory
{
    public string Name { get; set; }
    public List<string> SkipClasses { get; set; }
    public List<DataTransmogGroup> Groups { get; set; }
        
    public object Clone()
    {
        return new DataTransmogCategory
        {
            Name = (string)Name.Clone(),
            // We don't have to change these, reference is fine
            SkipClasses = SkipClasses,
            Groups = Groups,
        };
    }
}