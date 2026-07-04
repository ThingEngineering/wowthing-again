using System.Buffers.Binary;
using Equativ.RoaringBitmaps;

namespace Wowthing.Lib.Utilities;

public static class SerializationUtilities
{
    public static string SerializeAchievements(Dictionary<ushort, int> achievements)
    {
        Span<byte> buffer = stackalloc byte[achievements.Keys.Count * 6];
        int position = 0;

        foreach ((var key, var value) in achievements)
        {
            BinaryPrimitives.WriteUInt16LittleEndian(buffer.Slice(position, 2), key);
            BinaryPrimitives.WriteInt32LittleEndian(buffer.Slice(position + 2, 4), value);
            position += 6;
        }

        return Convert.ToBase64String(buffer);
    }

    public static string SerializeUInt16Array(ushort[] array)
    {
        Span<byte> buffer = stackalloc byte[array.Length * 2];
        for (var i = 0; i < array.Length; i++)
        {
            BinaryPrimitives.WriteUInt16LittleEndian(buffer.Slice(i * 2, 2), array[i]);
        }

        return Convert.ToBase64String(buffer);
    }
    public static string SerializeInt32Array(int[] array)
    {
        Span<byte> buffer = stackalloc byte[array.Length * 4];
        for (var i = 0; i < array.Length; i++)
        {
            BinaryPrimitives.WriteInt32LittleEndian(buffer.Slice(i * 4, 4), array[i]);
        }

        return Convert.ToBase64String(buffer);
    }

    public static List<int> AsDiffedList(IEnumerable<int> input)
    {
        var ret = new List<int>();
        int lastId = 0;
        foreach (int id in input.Distinct().Order())
        {
            ret.Add(id - lastId);
            lastId = id;
        }

        return ret;
    }

    public static byte[] SerializeToBitmap(IEnumerable<int> values)
    {
        var bitmap = RoaringBitmap.Create(values);
        using var stream = new MemoryStream();
        RoaringBitmap.Serialize(bitmap, stream);
        return stream.ToArray();
    }

    public static List<int> DeserializeFromBitmap(byte[] data)
    {
        using var stream = new MemoryStream(data);
        var bitmap = RoaringBitmap.Deserialize(stream);
        return bitmap.ToArray();
    }
}
