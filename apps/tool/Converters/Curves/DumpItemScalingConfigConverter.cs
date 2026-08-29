using Wowthing.Tool.Models.Curves;

namespace Wowthing.Tool.Converters.Curves;

public class DumpItemScalingConfigConverter : JsonConverter<DumpItemScalingConfig>
{
    public override DumpItemScalingConfig? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, DumpItemScalingConfig scalingConfig, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(scalingConfig.ID);
        writer.WriteNumberValue(scalingConfig.Flags);
        writer.WriteNumberValue(scalingConfig.ItemSquishEraID);
        writer.WriteNumberValue(scalingConfig.ItemOffsetCurveID);
        writer.WriteNumberValue(scalingConfig.ItemLevel);
        writer.WriteNumberValue(scalingConfig.RequiredLevel);
        writer.WriteEndArray();
    }
}
