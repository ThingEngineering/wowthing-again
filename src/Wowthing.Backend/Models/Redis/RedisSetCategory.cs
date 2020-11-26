using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Wowthing.Backend.Models.Data;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisSetCategory
    {
        private const int SPLIT_THRESHOLD = 10;
        private const int SPLIT_SIZE = 8;

        public string Name { get; set; }
        public List<RedisSetGroup> Groups { get; set; } = new List<RedisSetGroup>();

        public RedisSetCategory()
        {
        }

        public RedisSetCategory(DataSetCategory cat)
        {
            Name = cat.Name;

            foreach (var group in cat.Groups)
            {
                if (group.Things.Count <= SPLIT_THRESHOLD)
                {
                    Groups.Add(new RedisSetGroup(group));
                }
                else
                {
                    var things = group.Things.ToArray();
                    var count = things.Length / SPLIT_SIZE;
                    var leftovers = things.Length % SPLIT_SIZE;

                    for (int i = 0; i < count; i++)
                    {
                        var name = $"{group.Name} ({i + 1})";
                        Groups.Add(new RedisSetGroup(
                            name,
                            new ArraySegment<string>(
                                things,
                                i * SPLIT_SIZE,
                                SPLIT_SIZE
                            )
                        ));
                    }

                    if (leftovers > 0)
                    {
                        var name = $"{group.Name} ({count + 1})";
                        Groups.Add(new RedisSetGroup(
                            name,
                            new ArraySegment<string>(
                                things,
                                count * SPLIT_SIZE,
                                leftovers
                            )
                        ));
                    }
                }
            }
        }
    }
}
