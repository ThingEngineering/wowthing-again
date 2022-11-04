using System.Text;
using Microsoft.Extensions.ObjectPool;

namespace Wowthing.Lib.Utilities;

public class LuaToJsonConverter3
{
    private readonly ObjectPool<StringBuilder> _builderPool;

    private LuaToJsonConverter3()
    {
        var poolProvider = new DefaultObjectPoolProvider();
        _builderPool = poolProvider.CreateStringBuilderPool();
    }

    public static string Convert(string luaText)
    {
        var converter = new LuaToJsonConverter3();
        var enumerator = luaText.SplitLines();
        var (_, builder) = converter.Recurse(ref enumerator, true);
        return builder.ToString();
    }

    public (StructureType type, StringBuilder builder) Recurse(ref StringExtensions.LineSplitEnumerator enumerator, bool first = false)
    {
        var builder = _builderPool.Get();
        var type = StructureType.Array;
        while (enumerator.MoveNext())
        {
            var lineSpan = enumerator.Current.Line;

            int startIndex = lineSpan.IndexOfAnyExcept('\t');
            if (startIndex == -1)
            {
                continue;
            }

            int commentIndex = lineSpan.LastIndexOf(", -- ");
            int endIndex = commentIndex > 0 ? commentIndex : lineSpan.Length;

            if (lineSpan.EndsWith(","))
            {
                endIndex--;
            }

            lineSpan = lineSpan[startIndex..endIndex];

            if (lineSpan[0] == '{')
            {
                var (subType, subBuilder) = Recurse(ref enumerator);
                AppendAndRelease(builder, subType, subBuilder, first);
                continue;
            }
            if (lineSpan[0] == '}')
            {
                break;
            }

            // ["foo"] = {
            if (lineSpan[0] == '[')
            {
                var keySpan = lineSpan[1..lineSpan.IndexOf(']')];
                var value = lineSpan[(lineSpan.IndexOf(" = ") + 3)..];

                type = StructureType.Dictionary;

                if (value[0] == '{')
                {
                    var (subType, subBuilder) = Recurse(ref enumerator);
                    if (subBuilder.Length > 0)
                    {
                        if (keySpan[0] == '"')
                        {
                            builder.Append($"{keySpan}:");
                        }
                        else
                        {
                            builder.Append($"\"{keySpan}\":");
                        }
                    }

                    AppendAndRelease(builder, subType, subBuilder, first);
                    continue;
                }

                if (value[0] == '}')
                {
                    break;
                }

                if (keySpan[0] == '"')
                {
                    builder.Append($"{keySpan}:");
                }
                else
                {
                    builder.Append($"\"{keySpan}\":");
                }

                builder.Append($"{value},");
            }
            else
            {
                // Not [key] = value?
                builder.Append($"{lineSpan},");
            }
        }

        return (type, builder);
    }

    private void AppendAndRelease(
        StringBuilder builder,
        StructureType subType,
        StringBuilder subBuilder,
        bool skipComma
    )
    {
        if (subBuilder.Length > 0)
        {
            // This is faster and more memory efficient than an interpolated string
            if (subType == StructureType.Array)
            {
                builder
                    .Append('[')
                    .Append(subBuilder)
                    .Append(']');
            }
            else
            {
                builder
                    .Append('{')
                    .Append(subBuilder)
                    .Append('}');
            }

            if (!skipComma)
            {
                builder.Append(',');
            }
        }

        _builderPool.Return(subBuilder);
    }
}
