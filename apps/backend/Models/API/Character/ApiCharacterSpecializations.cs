namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterSpecializations
{
    public List<ApiCharacterSpecializationsSpecialization> Specializations { get; set; }
}

public class ApiCharacterSpecializationsSpecialization
{
    public ApiObnoxiousObject Specialization { get; set; }

    [JsonPropertyName("pvp_talent_slots")]
    public List<ApiCharacterSpecializationsPvpTalent> PvpTalents { get; set; }

    public List<ApiCharacterSpecializationsTalent> Talents { get; set; }
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

public class ApiCharacterSpecializationsTalent
{
    [JsonPropertyName("column_index")]
    public int ColumnIndex { get; set; }

    [JsonPropertyName("tier_index")]
    public int TierIndex { get; set; }

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
