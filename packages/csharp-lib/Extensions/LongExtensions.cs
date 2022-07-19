namespace Wowthing.Lib.Extensions;

public static class LongExtensions
{
    public static DateTime AsUtcTimestamp(this long timestamp)
    {
        return DateTimeOffset.FromUnixTimeMilliseconds(timestamp).UtcDateTime;
    }
}