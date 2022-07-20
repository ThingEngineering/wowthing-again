namespace Wowthing.Lib.Extensions;

public static class TypeExtensions
{
    public static T GetAttribute<T>(this Type type)
        where T : Attribute
    {
        return (T)Attribute.GetCustomAttribute(type, typeof(T));
    }

    public static T[] GetAttributes<T>(this Type type)
        where T : Attribute
    {
        return (T[])Attribute.GetCustomAttributes(type, typeof(T));
    }
}