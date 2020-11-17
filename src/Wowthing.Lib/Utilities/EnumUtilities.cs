using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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
