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

        public RedisSetGroup(DataSetGroup group)
        {
            Name = group.Name;
            Things = group.Things
                .Select(t =>
                    t.Split(' ')
                        .Select(s => int.Parse(s))
                        .ToArray())
                .ToList();
        }
    }
}
