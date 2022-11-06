using System.Text;

namespace Wowthing.Lib.Utilities;

public class LuaToJsonConverter4
{
    private readonly StringBuilder _builder;

    private LuaToJsonConverter4(int luaSize)
    {
        _builder = new StringBuilder((int)(luaSize * 0.8));
    }

    public override string ToString()
    {
        return _builder.ToString();
    }

    public static string Convert(string luaText)
    {
        var converter = new LuaToJsonConverter4(luaText.Length);
        var enumerator = luaText.SplitLines();
        converter.Recurse(ref enumerator, ReadOnlySpan<char>.Empty);
        return converter.ToString();
    }

    private void Recurse(
        ref StringExtensions.LineSplitEnumerator enumerator,
        ReadOnlySpan<char> outerKey
    )
    {
        bool wroteOpener = false;
        int initialPosition = _builder.Length;
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
                if (!wroteOpener)
                {
                    WriteKey(outerKey);
                }
                wroteOpener = WriteOpener(wroteOpener, type);

                Recurse(ref enumerator, ReadOnlySpan<char>.Empty);
                continue;
            }
            if (lineSpan[0] == '}')
            {
                if (_builder.Length > initialPosition)
                {
                    WriteCloser(type);
                }
                break;
            }

            // ["foo"] = {
            if (lineSpan[0] == '[')
            {
                var keySpan = lineSpan[1..lineSpan.IndexOf(']')];
                var valueSpan = lineSpan[(lineSpan.IndexOf(" = ") + 3)..];

                type = StructureType.Dictionary;

                if (!wroteOpener)
                {
                    WriteKey(outerKey);
                }
                wroteOpener = WriteOpener(wroteOpener, type);

                if (valueSpan[0] == '{')
                {
                    Recurse(ref enumerator, keySpan);
                    continue;
                }

                WriteKey(keySpan);
                _builder.Append($"{valueSpan},");
            }
            else
            {
                // Not [key] = value?
                if (!wroteOpener)
                {
                    WriteKey(outerKey);
                }
                wroteOpener = WriteOpener(wroteOpener, type);

                _builder.Append($"{lineSpan},");
            }
        }
    }

    private bool WriteOpener(bool written, StructureType type)
    {
        if (!written)
        {
            _builder.Append(type == StructureType.Array ? '[' : '{');
        }
        return true;
    }

    private void WriteCloser(StructureType type)
        => _builder.Append(type == StructureType.Array ? ']' : '}').Append(',');

    private void WriteKey(ReadOnlySpan<char> keySpan)
    {
        if (keySpan.Length == 0)
        {
            return;
        }

        if (keySpan[0] == '"')
        {
            _builder.Append($"{keySpan}:");
        }
        else
        {
            _builder.Append($"\"{keySpan}\":");
        }
    }
}
