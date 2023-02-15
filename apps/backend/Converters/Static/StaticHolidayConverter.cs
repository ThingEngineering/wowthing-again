using System.Text.Json;
using Wowthing.Backend.Models.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Converters;

public class StaticHolidayConverter : System.Text.Json.Serialization.JsonConverter<StaticHoliday>
{
    public override StaticHoliday Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticHoliday holiday, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(holiday.Id);
        writer.WriteStringValue(holiday.Name);
        writer.WriteNumberValue(holiday.FilterType);
        writer.WriteNumberValue(holiday.Flags);
        writer.WriteNumberValue(holiday.Looping);
        writer.WriteNumberValue(holiday.Priority);
        writer.WriteNumberValue(holiday.Region);

        writer.WriteStartArray();
        foreach (short duration in holiday.Durations)
        {
            writer.WriteNumberValue(duration);
        }
        writer.WriteEndArray();

        writer.WriteStartArray();
        foreach (var startDate in holiday.StartDates)
        {
            writer.WriteNumberValue(((DateTimeOffset)startDate).ToUnixTimeSeconds());
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
