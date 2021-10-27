using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Wowthing.Lib.Extensions
{
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

        private static readonly Regex Hyphens = new Regex(@"\-+", RegexOptions.Compiled);
        private static readonly Regex InvalidCharacters = new Regex(@"[^a-z0-9\s-]", RegexOptions.Compiled);
        private static readonly Regex Whitespace = new Regex(@"\s", RegexOptions.Compiled);
        public static string Slugify(this string s)
        {
            s = s.ToLower();
            s = InvalidCharacters.Replace(s, "");
            s = Whitespace.Replace(s, "-");
            s = Hyphens.Replace(s, "-");
            s = s.Trim('-');
            return s;
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
    }
}
