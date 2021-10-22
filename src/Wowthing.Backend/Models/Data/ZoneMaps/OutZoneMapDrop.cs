using Newtonsoft.Json;

namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    public class OutZoneMapDrop
    {
        public int Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? RequiredQuestId { get; set; }
        
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

            if (drop.RequiredQuestId > 0)
            {
                RequiredQuestId = drop.RequiredQuestId;
            }
        }
    }
}
