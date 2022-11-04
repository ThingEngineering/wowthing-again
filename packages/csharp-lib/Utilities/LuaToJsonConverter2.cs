using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.ObjectPool;

namespace Wowthing.Lib.Utilities;

public class LuaToJsonConverter2
{
    private int _index;
    private readonly string[] _lines;
    private readonly ObjectPool<StringBuilder> _builderPool;

    public LuaToJsonConverter2(string luaText)
    {
        _lines = luaText.SplitLines(true);

        var poolProvider = new DefaultObjectPoolProvider();
        _builderPool = poolProvider.CreateStringBuilderPool();
    }

    public static string Convert(string luaText)
    {
        var converter = new LuaToJsonConverter2(luaText);
        var (_, builder) = converter.Recurse();
        return builder.ToString();

        /*if (type == StructureType.Array)
        {
            return "[" + converted + "]";
        }
        else if (type == StructureType.Dictionary)
        {
            return "{" + converted + "}";
        }
        else
        {
            return "WTF?";
        }*/
    }

    private static readonly Regex Line = new Regex(@"^\s*(.*?),?(?: -- \[\d+\])?$", RegexOptions.Compiled);
    private static readonly Regex KeyValue = new Regex(@"^\[(.*?)\] = (.*?)?$", RegexOptions.Compiled);

    public (StructureType type, StringBuilder builder) Recurse()
    {
        var builder = _builderPool.Get();
        var type = StructureType.Array;

        while (_index < _lines.Length)
        {
            var m = Line.Match(_lines[_index++]);
            if (!m.Success)
            {
                throw new Exception($"Bad input line >{_lines[_index-2]}< >{_lines[_index-1]}<");
            }

            string line = m.Groups[1].Value;

            if (line == "{")
            {
                /*var rText = Recurse();
                if (rText != "[]")
                {
                    _builder.Append($"{rText},");
                    //lines.Add(rText);
                }*/
                var (subType, subBuilder) = Recurse();
                AppendAndRelease(builder, subType, subBuilder);
                continue;
            }
            if (line == "}")
            {
                break;
            }

            // ["foo"] = {
            m = KeyValue.Match(line);
            if (m.Success)
            {
                type = StructureType.Dictionary;

                string key = m.Groups[1].Value;
                string value = m.Groups[2].Value;

                if (!key.StartsWith('"'))
                {
                    key = $"\"{key}\"";
                }

                if (value == "{")
                {
                    var (subType, subBuilder) = Recurse();
                    if (subBuilder.Length > 0)
                    {
                        builder
                            .Append(key)
                            .Append(':');
                    }
                    AppendAndRelease(builder, subType, subBuilder);
                    continue;
                }
                if (value == "}")
                {
                    break;
                }

                builder.Append($"{key}:{value},");
            }
            else
            {
                // Not [key] = value?
                builder.Append($"{line},");
            }
        }

        return (type, builder);
    }

    private void AppendAndRelease(
        StringBuilder builder,
        StructureType subType,
        StringBuilder subBuilder
    )
    {
        if (subBuilder.Length > 0)
        {
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
            builder.Append(',');
        }

        _builderPool.Return(subBuilder);
    }
}
