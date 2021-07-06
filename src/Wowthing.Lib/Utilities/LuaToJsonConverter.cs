using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Wowthing.Lib.Extensions;

namespace Wowthing.Lib.Utilities
{
    public class LuaToJsonConverter
    {
        private int _index;
        private int _indent;
        private readonly string[] _lines;

        public LuaToJsonConverter(string luaText)
        {
            _lines = luaText.SplitLines(true);
        }

        public static string Convert(string luaText)
        {
            var converter = new LuaToJsonConverter(luaText);
            var sb = new StringBuilder();

            var (type, converted) = converter.Recurse();

            if (type == StructureType.Array)
            {
                sb.AppendLine("[");
                sb.AppendLine(converted);
                sb.AppendLine("]");
            }
            else if (type == StructureType.Dictionary)
            {
                sb.AppendLine("{");
                sb.AppendLine(converted);
                sb.AppendLine("}");
            }

            return sb.ToString();
        }

        private static readonly Regex Comment = new Regex(@" -- \[\d+\]$", RegexOptions.Compiled);
        private static readonly Regex Line = new Regex(@"^\s*(.*?)?$", RegexOptions.Compiled);
        private static readonly Regex KeyValue = new Regex(@"^\[(.*?)\] = (.*?)?$", RegexOptions.Compiled);

        public (StructureType, string) Recurse()
        {
            _indent += 2;
            var indent = new string(' ', _indent);

            var type = StructureType.Array;
            var lines = new List<string>();

            while (_index < _lines.Length)
            {
                string line = _lines[_index];
                _index++;

                // Strip comments
                line = Comment.Replace(line, "");
                // Trailing commas are annoying too
                line = line.TrimEnd(',');

                var m = Line.Match(line);
                if (!m.Success)
                {
                    throw new Exception($"Bad input line >{_lines[_index-1]}< >{line}<");
                }

                line = m.Groups[1].Value;

                if (line == "{")
                {
                    var (rType, rText) = Recurse();
                    if (rType == StructureType.Array)
                    {
                        lines.Add($"{indent}[\n{rText}{indent}]");
                    }
                    else if (rType == StructureType.Dictionary)
                    {
                        lines.Add($"{indent}{{\n{rText}{indent}}}");
                    }
                    continue;
                }
                else if (line == "}")
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
                        var (rType, rText) = Recurse();
                        if (rType == StructureType.Array)
                        {
                            lines.Add($"{indent}{key}: [\n{rText}{indent}]");
                        }
                        else if (rType == StructureType.Dictionary)
                        {
                            lines.Add($"{indent}{key}: {{\n{rText}{indent}}}");
                        }
                        continue;
                    }
                    else if (value == "}")
                    {
                        break;
                    }

                    lines.Add($"{indent}{key}: {value}");
                }
                else
                {
                    // Not [key] = value?
                    lines.Add($"{indent}{line}");
                }
            }

            _indent -= 2;

            var text = lines.Count > 0 ? string.Join(",\n", lines) + "\n" : "";
            return (type, text);
        }
    }

    public enum StructureType
    {
        Array,
        Dictionary,
    }
}
