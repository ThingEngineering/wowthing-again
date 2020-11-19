using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Lib.Extensions
{
    public static class TaskExtensions
    {
        public static async Task<Dictionary<TKey, TObj>> ToDictionaryAsync<TKey, TObj>(this Task<TObj[]> task, Func<TObj, TKey> keyFunc)
        {
            return (await task).ToDictionary(keyFunc);
        }
    }
}
