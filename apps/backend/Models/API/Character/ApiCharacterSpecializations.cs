namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterSpecializations
{
    public List<ApiCharacterSpecializationsSpecialization> Specializations { get; set; }
}

public class ApiCharacterSpecializationsSpecialization
{
    public ApiObnoxiousObject Specialization { get; set; }

    public List<ApiCharacterSpecializationsLoadout> Loadouts { get; set; }

    [JsonPropertyName("pvp_talent_slots")]
    public List<ApiCharacterSpecializationsPvpTalent> PvpTalents { get; set; }
}

public class ApiCharacterSpecializationsLoadout
{
    [JsonPropertyName("is_active")]
    public bool IsActive { get; set; }

    [JsonPropertyName("talent_loadout_code")]
    public string TalentLoadoutCode { get; set; }

    [JsonPropertyName("selected_class_talents")]
    public List<ApiCharacterSpecializationsTalent> ClassTalents { get; set; }

    [JsonPropertyName("selected_spec_talents")]
    public List<ApiCharacterSpecializationsTalent> SpecTalents { get; set; }

    [JsonPropertyName("selected_hero_talent_tree")]
    public ApiObnoxiousObject HeroTree { get; set; }

    [JsonPropertyName("selected_hero_talents")]
    public List<ApiCharacterSpecializationsTalent> HeroTalents { get; set; }
}

public class ApiCharacterSpecializationsTalent
{
    public int Id { get; set; }
    public int Rank { get; set; }
    public ApiCharacterSpecializationsTalentTooltip Tooltip { get; set; }
}

public class ApiCharacterSpecializationsTalentTooltip
{
    public ApiObnoxiousObject Talent { get; set; }

    [JsonPropertyName("spell_tooltip")]
    public ApiCharacterSpecializationsSpellTooltip SpellTooltip { get; set; }
}

public class ApiCharacterSpecializationsPvpTalent
{
    [JsonPropertyName("slot_number")]
    public int SlotNumber { get; set; }

    public ApiCharacterSpecializationsPvpTalentSelected Selected { get; set; }
}

public class ApiCharacterSpecializationsPvpTalentSelected
{
    public ApiObnoxiousObject Talent { get; set; }

    [JsonPropertyName("spell_tooltip")]
    public ApiCharacterSpecializationsSpellTooltip SpellTooltip { get; set; }
}

public class ApiCharacterSpecializationsSpellTooltip
{
    public ApiObnoxiousObject Spell { get; set; }
    public string Description { get; set; }

    [JsonPropertyName("cast_time")]
    public string CastTime { get; set; }
}
