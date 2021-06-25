using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Lib.Extensions
{
    public static class CollectionExtensions
    {
        public static Dictionary<TKey, TValue> EmptyIfNull<TKey, TValue>(this Dictionary<TKey, TValue> dict)
        {
            return dict ?? new Dictionary<TKey, TValue>();
        }

        public static List<T> EmptyIfNull<T>(this List<T> list)
        {
            return list ?? new List<T>();
        }
    }
}
