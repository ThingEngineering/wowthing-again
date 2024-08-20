namespace Wowthing.Lib.Converters;

public class RawCriteriaConverter: JsonConverter<Dictionary<int, Dictionary<int, List<int>>>>
{
    public override Dictionary<int, Dictionary<int, List<int>>> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, Dictionary<int, Dictionary<int, List<int>>> value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        foreach (var (criteriaId, criteriaData) in value.OrderBy(kvp => kvp.Key))
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(criteriaId);

            foreach (var (amount, characterIds) in criteriaData.OrderByDescending(kvp => kvp.Key))
            {
                writer.WriteStartArray();
                writer.WriteNumberValue(amount);

                foreach (int characterId in characterIds)
                {
                    writer.WriteNumberValue(characterId);
                }

                writer.WriteEndArray();
            }

            writer.WriteEndArray();
        }

        writer.WriteEndArray();
    }
}
