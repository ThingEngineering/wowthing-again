using System;
using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Utilities;

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
        
        public static IEnumerable<T> SelectManyRecursive<T>(this IEnumerable<T> source, Func<T, IEnumerable<T>> selector)
        {
            var result = source.SelectMany(selector);
            if (!result.Any())
            {
                return result;
            }
            return result.Concat(result.SelectManyRecursive(selector));
        }

        public static string ToPackedUInt16Array(this List<int> list)
        {
            return SerializationUtilities.SerializeUInt16Array(list.Select(id => Convert.ToUInt16(id)).ToArray());
        }
    }
}
