using System.Numerics;

namespace Wowthing.Tool.Extensions;

public static class ListExtensions
{
    public static List<T> TrimTrailingZeroes<T>(this List<T> list)
        where T : INumber<T>
    {
        var ret = new List<T>();
        var zero = T.CreateChecked(0);

        for (int i = list.Count - 1; i >= 0; i--)
        {
            if (list[i] != zero)
            {
                ret.AddRange(list[..(i + 1)]);
                break;
            }
        }

        return ret;
    }
}
