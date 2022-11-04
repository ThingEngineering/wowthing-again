using System.Text.RegularExpressions;

namespace Wowthing.Lib.Utilities.LuaParser;

public class LuaParser
{
    private static readonly Regex LeadingSpaces = new Regex(@"^\s*", RegexOptions.Compiled);

    public static string Parse(string luaText)
    {
        foreach (ReadOnlySpan<char> line in luaText.SplitLines())
        {
            var currentLine = line;

            var en = LeadingSpaces.EnumerateMatches(line);
            if (en.MoveNext())
            {
                currentLine = line[en.Current.Length..];
            }

            //Console.WriteLine($">{currentLine[..Math.Min(currentLine.Length, 100)]}");
        }

        return "";
    }
}

public enum LuaState
{
    Initial,
    InArray,
    InObject,
}

