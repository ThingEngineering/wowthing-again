using System;

namespace Wowthing.Lib.Extensions
{
    public static class IntExtensions
    {
        public static DateTime AsUtcDateTime(this int timestamp)
        {
            return DateTimeOffset.FromUnixTimeSeconds(timestamp).UtcDateTime;
        }
    }
}
