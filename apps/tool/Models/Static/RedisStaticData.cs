using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models.Covenants;
using Wowthing.Tool.Models.Professions;

namespace Wowthing.Tool.Models.Static;

public class RedisStaticData
{
    public List<List<int>> RawBags { get; set; }

    public Dictionary<int, string> InventorySlots { get; set; }
    public Dictionary<int, string> InventoryTypes { get; set; }
    public Dictionary<int, string> QuestNames { get; set; }
    public Dictionary<int, string> SharedStrings { get; set; }
    public Dictionary<int, string> Titles { get; set; }

    public Dictionary<short, StaticCharacterClass> CharacterClasses { get; set; }
    public Dictionary<short, StaticCharacterRace> CharacterRaces { get; set; }
    public Dictionary<short, StaticCharacterSpecialization> CharacterSpecializations { get; set; }
    public Dictionary<int, string> Enchantments { get; set; }
    public List<StaticHeirloom> Heirlooms { get; set; }
    public Dictionary<int, StaticIllusion> Illusions { get; set; }
    public List<OutInstance> InstancesRaw { get; set; }
    public Dictionary<int, StaticKeystoneAffix> KeystoneAffixes { get; set; }
    public Dictionary<int, int> ItemToRequiredAbility { get; set; }
    public Dictionary<int, short[]> ItemToSkillLine { get; set; }
    public Dictionary<int, OutProfession> Professions { get; set; }
    public List<WowRealm> RawRealms { get; set; }
    public SortedDictionary<int, StaticReputationTier> ReputationTiers { get; set; }
    public Dictionary<int, List<OutSoulbind>> Soulbinds { get; set; }
    public Dictionary<int, List<List<int>>> Talents { get; set; }

    public Dictionary<string, List<int>> HolidayIds { get; set; }

    public StaticCurrency[] RawCurrencies { get; set; }
    public StaticCurrencyCategory[] RawCurrencyCategories { get; set; }
    public StaticHoliday[] RawHolidays { get; set; }
    public StaticMount[] RawMounts { get; set; }
    public StaticPet[] RawPets { get; set; }
    public StaticReputation[] RawReputations { get; set; }
    public StaticToy[] RawToys { get; set; }
    public StaticTransmogSet[] RawTransmogSets { get; set; }

    public List<StaticReputationCategory> RawReputationSets { get; set; }
}
