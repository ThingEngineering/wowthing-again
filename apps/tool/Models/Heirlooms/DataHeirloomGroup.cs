using Wowthing.Tool.Converters.Manual;

namespace Wowthing.Tool.Models.Heirlooms;

[JsonConverter(typeof(DataHeirloomGroupConverter))]
public class DataHeirloomGroup : ICloneable, IDataCategory
{
    public string Name { get; set; } = string.Empty;
    public DataHeirloomItem[]? Items { get; set; }

    public object Clone()
    {
        return new DataHeirloomGroup
        {
            Name = Name,
            Items = Items,
        };
    }
}
