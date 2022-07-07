﻿using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Achievements
{
    [JsonConverter(typeof(OutCriteriaConverter))]
    public class OutCriteria
    {
        public int Asset { get; }
        public int Id { get; }
        public int ModifierTreeId { get; }
        public int Type { get; }

        public OutCriteria(DumpCriteria criteria)
        {
            Asset = criteria.Asset;
            Id = criteria.ID;
            ModifierTreeId = criteria.ModifierTreeID;
            Type = criteria.Type;
        }
    }
}
