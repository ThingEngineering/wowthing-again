using System;
using System.Collections.Generic;
using System.Linq;
using Wowthing.Backend.Models.Data;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisSetCategory
    {
        private const int SplitThreshold = 10;
        private const int SplitSize = 8;

        public string Name { get; set; }
        public List<RedisSetGroup> Groups { get; set; } = new List<RedisSetGroup>();

        public string Slug => Name.Slugify();

        public RedisSetCategory()
        {
        }

        public RedisSetCategory(DataSetCategory cat)
        {
            Name = cat.Name;

            foreach (var group in cat.Groups ?? Enumerable.Empty<DataSetGroup>())
            {
                if (group.Things.Count <= SplitThreshold)
                {
                    Groups.Add(new RedisSetGroup(group));
                }
                else
                {
                    var things = group.Things.ToArray();
                    var count = things.Length / SplitSize;
                    var leftovers = things.Length % SplitSize;

                    for (int i = 0; i < count; i++)
                    {
                        var name = $"{group.Name} ({i + 1})";
                        Groups.Add(new RedisSetGroup(
                            name,
                            new ArraySegment<string>(
                                things,
                                i * SplitSize,
                                SplitSize
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
                                count * SplitSize,
                                leftovers
                            )
                        ));
                    }
                }
            }
        }
    }
}
