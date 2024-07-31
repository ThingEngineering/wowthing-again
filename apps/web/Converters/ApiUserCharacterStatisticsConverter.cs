using System.Text.Json;
using Wowthing.Web.Models.Api.User;

namespace Wowthing.Web.Converters;

public class ApiUserCharacterStatisticsConverter : JsonConverter<ApiUserCharacterStatistics>
{
    public override ApiUserCharacterStatistics Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ApiUserCharacterStatistics stats, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        // Basic
        writer.WriteStartArray();
        foreach (var (type, value) in stats.Basic)
        {
            writer.WriteStartArray();

            writer.WriteNumberValue((int)type);
            writer.WriteNumberValue(value.Base);
            writer.WriteNumberValue(value.Effective);

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        // Misc
        writer.WriteStartArray();
        foreach (var (type, value) in stats.Misc)
        {
            writer.WriteStartArray();

            writer.WriteNumberValue((int)type);
            writer.WriteNumberValue(value);

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        // Rating
        writer.WriteStartArray();
        foreach (var (type, value) in stats.Rating)
        {
            writer.WriteStartArray();

            writer.WriteNumberValue((int)type);
            writer.WriteNumberValue(value.Rating);
            writer.WriteNumberValue(value.RatingBonus);

            if (value.Value.HasValue)
            {
                writer.WriteNumberValue(value.Value.Value);
            }

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
