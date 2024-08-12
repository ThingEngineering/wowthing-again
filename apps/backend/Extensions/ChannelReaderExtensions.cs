using System.Threading.Channels;

namespace Wowthing.Backend.Extensions;

public static class ChannelReaderExtensions
{
    public static List<T> Flush<T>(this ChannelReader<T> reader)
    {
        var ret = new List<T>();
        while (reader.TryRead(out T item))
        {
            ret.Add(item);
        }

        return ret;
    }
}
