using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticHolidayConverter : JsonConverter<StaticHoliday>
{
    public override StaticHoliday Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticHoliday holiday, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(holiday.Id);
        writer.WriteNumberValue(holiday.NameId);
        writer.WriteNumberValue(holiday.DescriptionId);
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
