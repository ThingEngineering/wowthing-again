﻿using System.Text.Json;

namespace Wowthing.Lib.Extensions;

public static class Utf8JsonWriterExtensions
{
    public static void WriteNumberArray(this Utf8JsonWriter writer, IEnumerable<int> values)
    {
        writer.WriteStartArray();
        foreach (int value in values)
        {
            writer.WriteNumberValue(value);
        }
        writer.WriteEndArray();
    }

    public static void WriteStringArray(this Utf8JsonWriter writer, IEnumerable<string> values)
    {
        writer.WriteStartArray();
        foreach (string value in values)
        {
            writer.WriteStringValue(value);
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
            writeFunc(writer, value);
        }
        writer.WriteEndArray();
    }
}
