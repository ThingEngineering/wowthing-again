namespace Wowthing.Tool.Models.Heirlooms;

[JsonConverter(typeof(DataHeirloomGroupConverter))]
public class DataHeirloomGroup : ICloneable, IDataCategory
{
    public string Name { get; set; }
    public DataHeirloomItem[] Items { get; set; }

    public object Clone()
    {
        return new DataHeirloomGroup
        {
            Name = Name,
            Items = Items,
        };
    }
}
