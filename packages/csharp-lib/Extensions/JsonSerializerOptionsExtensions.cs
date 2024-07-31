namespace Wowthing.Lib.Extensions;

public static class JsonSerializerOptionsExtensions
{
    private static Dictionary<Type, JsonConverter> _converterCache = new();

    public static JsonConverter<T> GetTypedConverter<T>(this JsonSerializerOptions options)
    {
        Type typ = typeof(T);
        if (!_converterCache.TryGetValue(typ, out var converter))
        {
            converter = _converterCache[typ] = options.GetConverter(typ);
        }
        return (JsonConverter<T>)converter;
    }
}
