using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Illusions;

[JsonConverter(typeof(DataIllusionGroupConverter))]
public class DataIllusionGroup : ICloneable, IDataCategory
{
    public string Name { get; set; }
    public DataIllusionItem[] Items { get; set; }

    public object Clone()
    {
        return new DataIllusionGroup
        {
            Name = Name,
            Items = Items,
        };
    }
}
