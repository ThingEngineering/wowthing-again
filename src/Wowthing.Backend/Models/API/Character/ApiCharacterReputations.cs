namespace Wowthing.Backend.Models.API.Character
{
    public class ApiCharacterReputations
    {
        public List<ApiCharacterReputationsReputation> Reputations { get; set; }
    }

    public class ApiCharacterReputationsReputation
    {
        public ApiObnoxiousObject Faction { get; set; }
        public ApiCharacterReputationsReputationStanding Standing { get; set; }
    }

    public class ApiCharacterReputationsReputationStanding
    {
        public int Max { get; set; }
        public int Raw { get; set; }
        public int Tier { get; set; }
        public int Value { get; set; }
        public string Name { get; set; }
    }
}
