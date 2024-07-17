using System.Collections;

namespace Wowthing.Tool.Extensions;

public static class BitArrayExtensions
{
    public static ulong ToUInt64(this BitArray bitArray)
    {
        ulong value = 0;
        for (int i = 0; i < bitArray.Count; i++)
        {
            if (bitArray.Get(i))
            {
                value |= 1UL << i;
            }
        }
        return value;
    }
}
