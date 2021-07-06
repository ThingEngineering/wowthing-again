using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.NonBlizzard
{
    public class ApiCharacterRaiderIo
    {
        [JsonProperty("mythic_plus_scores_by_season")]
        public List<ApiCharacterRaiderIoSeason> ScoresBySeason { get; set; }
    }

    public class ApiCharacterRaiderIoSeason
    {
        private static readonly Dictionary<string, int> SeasonMap = new Dictionary<string, int>
        {
            { "season-bfa-1", 1 },
            { "season-bfa-2", 2 },
            { "season-bfa-3", 3 },
            { "season-bfa-4", 4 },
            { "season-sl-1", 5 },
        };

        public string Season { get; set; }
        public Dictionary<string, decimal> Scores { get; set; }

        public int SeasonId => SeasonMap[Season];
        public decimal ScoreAll => Scores.GetValueOrDefault("all");
        public decimal ScoreDps => Scores.GetValueOrDefault("dps");
        public decimal ScoreHealer => Scores.GetValueOrDefault("healer");
        public decimal ScoreTank => Scores.GetValueOrDefault("tank");
        public decimal ScoreSpec1 => Scores.GetValueOrDefault("spec_0");
        public decimal ScoreSpec2 => Scores.GetValueOrDefault("spec_1");
        public decimal ScoreSpec3 => Scores.GetValueOrDefault("spec_2");
        public decimal ScoreSpec4 => Scores.GetValueOrDefault("spec_3");
    }
}
