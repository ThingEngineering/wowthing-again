using System;
using System.Linq;
using Newtonsoft.Json;
using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    [JsonConverter(typeof(OutZoneMapDropConverter))]
    public class OutZoneMapDrop
    {
        public int Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int[] QuestIds { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? RequiredQuestId { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string[] Limit { get; set; }

        public string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Note { get; set; }

        public string Type { get; set; }

        public OutZoneMapDrop(DataZoneMapDrop drop)
        {
            Id = drop.Id;
            Name = drop.Name;
            Type = drop.Type;

            if (!string.IsNullOrEmpty(drop.Limit))
            {
                Limit = drop.Limit.Split();
            }

            if (!string.IsNullOrEmpty(drop.Note))
            {
                Note = drop.Note;
            }

            if (!string.IsNullOrWhiteSpace(drop.QuestId))
            {
                QuestIds = drop.QuestId
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .Select(int.Parse)
                    .ToArray();
            }
            
            if (drop.RequiredQuestId > 0)
            {
                RequiredQuestId = drop.RequiredQuestId;
            }
        }
    }
}
