using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticReputationConverter : JsonConverter<StaticReputation>
{
    public override StaticReputation Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticReputation rep, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(rep.Id);
        writer.WriteNumberValue(rep.Expansion);
        writer.WriteNumberValue(rep.TierId);
        writer.WriteNumberValue(rep.ParentId);
        writer.WriteNumberValue(rep.ParagonId);
        writer.WriteNumberValue(rep.RenownCurrencyId);
        writer.WriteBooleanValue(rep.AccountWide);
        writer.WriteStringValue(rep.Name);

        writer.WriteNumberArray(rep.BaseValues);
        writer.WriteNumberArray(rep.MaxValues);

        writer.WriteEndArray();
    }
}
