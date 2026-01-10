using System.Security.Cryptography;
using Wowthing.Lib.Utilities;

namespace Wowthing.Lib.Extensions;

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

    public static T[] EmptyIfNull<T>(this T[] array)
    {
        return array ?? Array.Empty<T>();
    }

    public static TResult[] SelectArray<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, TResult> resultFunc)
    {
        return source
            .Select(resultFunc)
            .ToArray();
    }

    public static IEnumerable<T> SelectManyRecursive<T>(this IEnumerable<T> source, Func<T, IEnumerable<T>> selector)
    {
        var result = source
            .SelectMany(selector)
            .ToArray();
        if (result.Length == 0)
        {
            return result;
        }
        return result.Concat(result.SelectManyRecursive(selector));
    }

    public static string Sha256(this byte[] bytes)
    {
        using var hash = SHA256.Create();
        return string.Concat(hash
            .ComputeHash(bytes)
            .Select(b => b.ToString("x2")));
    }

    public static string ToPackedUInt16Array(this List<int> list)
    {
        return SerializationUtilities.SerializeUInt16Array(list.Select(id => Convert.ToUInt16(id)).ToArray());
    }

    public static Dictionary<TKey, TObject[]> ToGroupedDictionary<TObject, TKey>(
        this IEnumerable<TObject> things,
        Func<TObject, TKey> keyFunc
    )
    {
        return things
            .GroupBy(keyFunc)
            .ToDictionary(
                group => group.Key,
                group => group.ToArray()
            );
    }

    public static Dictionary<TKey, TReturn[]> ToGroupedDictionary<TObject, TKey, TReturn>(
        this IEnumerable<TObject> things,
        Func<TObject, TKey> keyFunc,
        Func<TObject, TReturn> valueFunc
    )
    {
        return things
            .GroupBy(keyFunc)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(valueFunc)
                    .ToArray()
            );
    }

    public static Dictionary<TKey, TResult> ToManyDictionary<TKey, TValue, TResult>(
        this IEnumerable<TValue> source,
        Func<TValue, IEnumerable<TKey>> keySelector,
        Func<TValue, TResult> valueSelector
    )
        where TKey : notnull
    {
        return source
            .SelectMany(value => keySelector(value).Select(thing => (thing, value)))
            .ToDictionary(tup => tup.Item1, tup => valueSelector(tup.Item2));
    }

    public static TValue GetOrNew<TKey, TValue>(this IDictionary<TKey, TValue> dict, TKey key)
        where TValue : new()
    {
        if (!dict.TryGetValue(key, out var value))
        {
            dict[key] = value = new TValue();
        }
        return value;
    }

    public static string Md5(this byte[] bytes)
    {
        using var hash = MD5.Create();
        return string.Concat(hash
            .ComputeHash(bytes)
            .Select(b => b.ToString("x2")));
    }
}
