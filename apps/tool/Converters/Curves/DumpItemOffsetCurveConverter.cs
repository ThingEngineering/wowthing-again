using Wowthing.Tool.Models.Curves;

namespace Wowthing.Tool.Converters.Curves;

public class DumpItemOffsetCurveConverter : JsonConverter<DumpItemOffsetCurve>
{
    public override DumpItemOffsetCurve? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, DumpItemOffsetCurve offsetCurve, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(offsetCurve.ID);
        writer.WriteNumberValue(offsetCurve.CurveID);
        writer.WriteNumberValue(offsetCurve.Offset);
        writer.WriteEndArray();
    }
}
