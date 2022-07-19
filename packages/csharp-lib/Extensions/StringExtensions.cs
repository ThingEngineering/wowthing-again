using System.Security.Cryptography;
using System.Text;
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

    public static string Slugify(this string s)
    {
        return s.ToSlug();
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
}