﻿using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Data.Vendors
{
    public class OutVendorItem
    {
        public int Id { get; set; }
        public int ClassMask { get; set; }
        public WowQuality Quality { get; set; }
        public Dictionary<string, int> Costs { get; set; } = new();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? AppearanceId { get; set; }

        public OutVendorItem(DataVendorItem item)
        {
            Id = item.Id;

            var parts = item.Cost.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < parts.Length; i += 2)
            {
                Costs[parts[i + 1]] = int.Parse(parts[i]);
            }

            if (item.AppearanceId > 0)
            {
                AppearanceId = item.AppearanceId;
            }
        }
    }
}
