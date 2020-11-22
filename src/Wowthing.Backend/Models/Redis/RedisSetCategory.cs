using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Wowthing.Backend.Models.Data;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisSetCategory
    {
        public string Name { get; set; }
        public List<RedisSetGroup> Groups { get; set; }

        public RedisSetCategory(DataSetCategory cat)
        {
            Name = cat.Name;
            Groups = cat.Groups.Select(g => new RedisSetGroup(g)).ToList();
        }
    }
}
