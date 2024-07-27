namespace Wowthing.Lib.Extensions;

public static class Utf8JsonReaderExtensions
{
    public static short ReadInt16(this ref Utf8JsonReader reader)
    {
        reader.Read();
        short value = reader.GetInt16();
        return value;
    }

    public static int ReadInt32(this ref Utf8JsonReader reader)
    {
        reader.Read();
        int value = reader.GetInt32();
        return value;
    }
}
