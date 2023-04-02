using Wowthing.Tool.Models.Journal;

namespace Wowthing.Tool.Converters.Journal;

public class OutJournalEncounterConverter : JsonConverter<OutJournalEncounter>
{
    public override OutJournalEncounter Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutJournalEncounter encounter, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(encounter.Id);
        writer.WriteStringValue(encounter.Name);

        // Groups
        writer.WriteStartArray();
        foreach (var group in encounter.Groups)
        {
            writer.WriteStartArray();
            writer.WriteStringValue(group.Name);

            // Items
            writer.WriteStartArray();
            foreach (var item in group.Items)
            {
                writer.WriteStartArray();
                writer.WriteNumberValue((int)item.Type);
                writer.WriteNumberValue(item.Id);
                writer.WriteNumberValue((int)item.Quality);
                writer.WriteNumberValue(item.ClassId);
                writer.WriteNumberValue(item.SubclassId);
                writer.WriteNumberValue(item.ClassMask);

                // Appearances
                writer.WriteStartArray();
                foreach (var appearance in item.Appearances)
                {
                    writer.WriteStartArray();

                    writer.WriteNumberValue(appearance.AppearanceId);
                    writer.WriteNumberValue(appearance.ModifierId);

                    // Difficulties
                    writer.WriteStartArray();
                    foreach (int difficulty in appearance.Difficulties)
                    {
                        writer.WriteNumberValue(difficulty);
                    }
                    writer.WriteEndArray();

                    writer.WriteEndArray();
                }
                writer.WriteEndArray();

                writer.WriteEndArray();
            }
            writer.WriteEndArray();

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        if (encounter.Statistics?.Count > 0)
        {
            writer.WriteStartArray();

            foreach ((int difficulty, int[] statisticIds) in encounter.Statistics)
            {
                writer.WriteStartArray();
                writer.WriteNumberValue(difficulty);

                // Statistic Ids
                writer.WriteStartArray();
                foreach (int statisticId in statisticIds)
                {
                    writer.WriteNumberValue(statisticId);
                }
                writer.WriteEndArray();

                writer.WriteEndArray();
            }

            writer.WriteEndArray();
        }

        writer.WriteEndArray();
    }
}
