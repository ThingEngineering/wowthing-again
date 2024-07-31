namespace Wowthing.Tool.Extensions;

public static class DictionaryExtensions
{
    public static Dictionary<TValue, TKey> ToReverseDictionary<TKey, TValue>(this Dictionary<TKey, TValue> dict)
        where TKey : notnull
        where TValue : notnull
    {
        return dict.ToDictionary(kvp => kvp.Value, kvp => kvp.Key);
    }
}
