using System;
using System.Collections.Generic;
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

        private static readonly Regex _invalidCharacters = new Regex(@"[^a-z0-9\s-]", RegexOptions.Compiled);
        private static readonly Regex _whitespace = new Regex(@"\s", RegexOptions.Compiled);
        public static string Slugify(this string s)
        {
            s = s.ToLower();
            s = _invalidCharacters.Replace(s, "");
            s = _whitespace.Replace(s, "-");
            return s;
        }

        private static readonly string[] _splits = new[] { "\r\n", "\r", "\n" };
        public static string[] SplitLines(this string s, bool removeEmpty = false)
        {
            return s.Split(_splits, removeEmpty ? StringSplitOptions.RemoveEmptyEntries : StringSplitOptions.None);
        }

        public static string Truncate(this string s, int maxLength)
        {
            return s.Substring(0, Math.Min(s.Length, maxLength));
        }
    }
}
