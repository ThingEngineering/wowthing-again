namespace Wowthing.Backend.Converters;

// Lua arrays are cursed, don't blow up the entire parser though
public class DefaultOnErrorConverter<T> : JsonConverter<T>
{
    public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        try
        {
            return JsonSerializer.Deserialize<T>(ref reader, options);
        }
        catch (JsonException)
        {
            reader.Skip();
            return default;
        }
    }

    public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}
