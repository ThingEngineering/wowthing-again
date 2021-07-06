using System;
using System.Linq;

namespace Wowthing.Lib.Utilities
{
    public static class EnumUtilities
    {
        public static T[] GetValues<T>()
        {
            return Enum.GetValues(typeof(T)).Cast<T>().ToArray();
        }
    }
}
