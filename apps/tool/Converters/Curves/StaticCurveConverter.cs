using Wowthing.Tool.Models.Curves;

namespace Wowthing.Tool.Converters.Curves;

public class StaticCurveConverter : JsonConverter<StaticCurve>
{
    public override StaticCurve? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticCurve curve, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(curve.Id);
        writer.WriteNumberValue(curve.Type);

        writer.WriteStartArray();
        foreach (var point in curve.Points)
        {
            writer.WriteNumberValue(point.Threshold);
            writer.WriteNumberValue(point.Value);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
