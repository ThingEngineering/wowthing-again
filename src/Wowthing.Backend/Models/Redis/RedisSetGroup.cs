using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Wowthing.Backend.Models.Data;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisSetGroup
    {
        public string Name { get; set; }
        public List<int[]> Things { get; set; }

        public RedisSetGroup()
        {
        }

        public RedisSetGroup(DataSetGroup group)
            : this(group.Name, group.Things)
        {
        }

        public RedisSetGroup(string name, IEnumerable<string> things)
        {
            Name = name;
            Things = things
                .Select(t =>
                    t.Trim()
                        .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => int.Parse(s))
                        .ToArray())
                .ToList();
        }
    }
}
