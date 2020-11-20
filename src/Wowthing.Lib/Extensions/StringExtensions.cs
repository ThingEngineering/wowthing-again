using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

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
    }
}
