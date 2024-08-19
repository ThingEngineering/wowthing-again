using Wowthing.Lib.Models.Query;

namespace Wowthing.Lib.Converters;

public class StatisticsQueryConverter : JsonConverter<StatisticsQuery>
{
    public override StatisticsQuery Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StatisticsQuery value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.CharacterId);
        writer.WriteNumberValue(value.Quantity);
        if (value.Description != null)
        {
            writer.WriteStringValue(value.Description);
        }
        writer.WriteEndArray();
    }
}
