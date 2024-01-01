using System.Text.RegularExpressions;

namespace Wowthing.Lib.Utilities;

public class LuaToJsonConverter
{
    private int _index;
    private readonly string[] _lines;

    public LuaToJsonConverter(string luaText)
    {
        _lines = luaText.SplitLines(true);
    }

    public static string Convert(string luaText)
    {
        var converter = new LuaToJsonConverter(luaText);

        var (_, converted) = converter.Recurse();
        return converted;

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

    public (StructureType, string) Recurse()
    {
        var type = StructureType.Array;
        var lines = new List<string>();

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
                var (_, rText) = Recurse();
                if (rText != "[]")
                {
                    lines.Add(rText);
                }
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
                    var (_, rText) = Recurse();
                    if (rText != "[]")
                    {
                        lines.Add($"{key}:{rText}");
                    }
                    continue;
                }
                if (value == "}")
                {
                    break;
                }

                lines.Add($"{key}:{value}");
            }
            else
            {
                // Not [key] = value?
                lines.Add($"{line}");
            }
        }

        if (type == StructureType.Array)
        {
            return (type, "[" + string.Join(",", lines) + "]");
        }
        else
        {
            return (type, "{" + string.Join(",", lines) + "}");
        }
    }
}

public enum StructureType
{
    Array,
    Dictionary,
}
