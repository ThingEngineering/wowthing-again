using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Collections;
using Wowthing.Backend.Models.Data.Covenants;
using Wowthing.Backend.Models.Data.Professions;
using Wowthing.Backend.Models.Data.Progress;
using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Backend.Models.Static;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Redis;

public class RedisStaticCache
{
    public List<List<int>> RawBags { get; set; }

    public Dictionary<short, StaticCharacterClass> CharacterClasses { get; set; }
    public Dictionary<short, StaticCharacterRace> CharacterRaces { get; set; }
    public Dictionary<short, StaticCharacterSpecialization> CharacterSpecializations { get; set; }
    public List<OutInstance> InstancesRaw { get; set; }
    public Dictionary<int, OutProfession> Professions { get; set; }
    public List<WowRealm> RealmsRaw { get; set; }
    public Dictionary<int, OutRaiderIoScoreTiers> RaiderIoScoreTiers { get; set; }
    public SortedDictionary<int, WowReputationTier> ReputationTiers { get; set; }
    public Dictionary<int, List<OutSoulbind>> Soulbinds { get; set; }
    public Dictionary<int, List<List<int>>> Talents { get; set; }

    public StaticCurrency[] RawCurrencies { get; set; }
    public StaticCurrencyCategory[] RawCurrencyCategories { get; set; }
    public StaticItem[] RawItems { get; set; }
    public List<JArray> RawMounts { get; set; }
    public List<JArray> RawPets { get; set; }
    public StaticReputation[] RawReputations { get; set; }
    public List<JArray> RawToys { get; set; }

    public List<DataReputationCategory> RawReputationSets { get; set; }
}