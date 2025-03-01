using System.Numerics;

namespace Wowthing.Lib.Extensions;

public static class Utf8JsonWriterExtensions
{
    public static void WriteNumberArray<T>(this Utf8JsonWriter writer, IEnumerable<T> values)
        where T : IBinaryInteger<T>
    {
        writer.WriteStartArray();
        if (values != null)
        {
            foreach (var value in values)
            {
                writer.WriteNumberValue(Convert.ToInt64(value));
            }
        }
        writer.WriteEndArray();
    }

    public static void WriteStringArray(this Utf8JsonWriter writer, IEnumerable<string> values)
    {
        writer.WriteStartArray();
        if (values != null)
        {
            foreach (string value in values)
            {
                writer.WriteStringValue(value);
            }
        }
        writer.WriteEndArray();
    }

    public static void WriteObjectArray<T>(
        this Utf8JsonWriter writer,
        IEnumerable<T> values,
        Action<Utf8JsonWriter, T> writeFunc
    )
    {
        writer.WriteStartArray();
        foreach (var value in values)
        {
            if (value != null)
            {
                writeFunc(writer, value);
            }
            else
            {
                writer.WriteNullValue();
            }
        }
        writer.WriteEndArray();
    }
}
