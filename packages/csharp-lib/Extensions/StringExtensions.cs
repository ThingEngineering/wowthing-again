﻿using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using SluggyUnidecode;

namespace Wowthing.Lib.Extensions;

public static class StringExtensions
{
    public static string Md5(this string s)
    {
        using var hash = MD5.Create();
        return string.Concat(hash
            .ComputeHash(Encoding.UTF8.GetBytes(s))
            .Select(b => b.ToString("x2")));
    }

    public static string Sha256(this string s)
    {
        using var hash = SHA256.Create();
        return string.Concat(hash
            .ComputeHash(Encoding.UTF8.GetBytes(s))
            .Select(b => b.ToString("x2")));
    }

    private static readonly Regex IconStringRegex = new Regex(@"\:\S+\:", RegexOptions.Compiled);

    public static string Slugify(this string s)
    {
        if (string.IsNullOrWhiteSpace(s))
        {
            return null;
        }

        return IconStringRegex.Replace(s, "")
            .Replace('-', ' ')
            .ToSlug();
    }

    private static readonly string[] Splits = new[] { "\r\n", "\r", "\n" };

    public static string[] SplitLines(this string s, bool removeEmpty = false)
    {
        return s.Split(Splits, removeEmpty ? StringSplitOptions.RemoveEmptyEntries : StringSplitOptions.None);
    }

    public static string Truncate(this string s, int maxLength)
    {
        return string.IsNullOrWhiteSpace(s) ? "" : s[..Math.Min(s.Length, maxLength)];
    }

    public static string EmptyIfNullOrWhitespace(this string s)
    {
        return string.IsNullOrWhiteSpace(s) ? "" : s;
    }

    public static string OrDefault(this string s, string defaultValue)
    {
        return string.IsNullOrWhiteSpace(s) ? defaultValue : s;
    }

    // https://www.meziantou.net/split-a-string-into-lines-without-allocation.htm
    #region Span SplitLines

    public static LineSplitEnumerator SplitLines(this string str)
    {
        // LineSplitEnumerator is a struct so there is no allocation here
        return new LineSplitEnumerator(str.AsSpan());
    }

    // Must be a ref struct as it contains a ReadOnlySpan<char>
    public ref struct LineSplitEnumerator
    {
        private ReadOnlySpan<char> _str;

        public LineSplitEnumerator(ReadOnlySpan<char> str)
        {
            _str = str;
            Current = default;
        }

        // Needed to be compatible with the foreach operator
        public LineSplitEnumerator GetEnumerator() => this;

        public bool MoveNext()
        {
            var span = _str;
            if (span.Length == 0) // Reach the end of the string
                return false;

            var index = span.IndexOfAny('\r', '\n');
            if (index == -1) // The string is composed of only one line
            {
                _str = ReadOnlySpan<char>.Empty; // The remaining string is an empty string
                Current = new LineSplitEntry(span, ReadOnlySpan<char>.Empty);
                return true;
            }

            if (index < span.Length - 1 && span[index] == '\r')
            {
                // Try to consume the '\n' associated to the '\r'
                var next = span[index + 1];
                if (next == '\n')
                {
                    Current = new LineSplitEntry(span.Slice(0, index), span.Slice(index, 2));
                    _str = span.Slice(index + 2);
                    return true;
                }
            }

            Current = new LineSplitEntry(span.Slice(0, index), span.Slice(index, 1));
            _str = span.Slice(index + 1);
            return true;
        }

        public LineSplitEntry Current { get; private set; }
    }

    public readonly ref struct LineSplitEntry
    {
        public LineSplitEntry(ReadOnlySpan<char> line, ReadOnlySpan<char> separator)
        {
            Line = line;
            Separator = separator;
        }

        public ReadOnlySpan<char> Line { get; }
        public ReadOnlySpan<char> Separator { get; }

        // This method allow to deconstruct the type, so you can write any of the following code
        // foreach (var entry in str.SplitLines()) { _ = entry.Line; }
        // foreach (var (line, endOfLine) in str.SplitLines()) { _ = line; }
        // https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/deconstruct?WT.mc_id=DT-MVP-5003978#deconstructing-user-defined-types
        public void Deconstruct(out ReadOnlySpan<char> line, out ReadOnlySpan<char> separator)
        {
            line = Line;
            separator = Separator;
        }

        // This method allow to implicitly cast the type into a ReadOnlySpan<char>, so you can write the following code
        // foreach (ReadOnlySpan<char> entry in str.SplitLines())
        public static implicit operator ReadOnlySpan<char>(LineSplitEntry entry) => entry.Line;
    }

    #endregion
}
