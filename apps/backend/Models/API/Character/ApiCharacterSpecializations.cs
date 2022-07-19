namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterSpecializations
{
    public List<ApiCharacterSpecializationsSpecialization> Specializations { get; set; }
}

public class ApiCharacterSpecializationsSpecialization
{
    public ApiObnoxiousObject Specialization { get; set; }
        
    [JsonProperty("pvp_talent_slots")]
    public List<ApiCharacterSpecializationsPvpTalent> PvpTalents { get; set; }
        
    public List<ApiCharacterSpecializationsTalent> Talents { get; set; }
}

public class ApiCharacterSpecializationsPvpTalent
{
    [JsonProperty("slot_number")]
    public int SlotNumber { get; set; }
        
    public ApiCharacterSpecializationsPvpTalentSelected Selected { get; set; }
}

public class ApiCharacterSpecializationsPvpTalentSelected
{
    public ApiObnoxiousObject Talent { get; set; }

    [JsonProperty("spell_tooltip")]
    public ApiCharacterSpecializationsSpellTooltip SpellTooltip { get; set; }
}
    
public class ApiCharacterSpecializationsTalent
{
    [JsonProperty("column_index")]
    public int ColumnIndex { get; set; }
        
    [JsonProperty("tier_index")]
    public int TierIndex { get; set; }
        
    public ApiObnoxiousObject Talent { get; set; }
        
    [JsonProperty("spell_tooltip")]
    public ApiCharacterSpecializationsSpellTooltip SpellTooltip { get; set; }
}

public class ApiCharacterSpecializationsSpellTooltip
{
    public ApiObnoxiousObject Spell { get; set; }
    public string Description { get; set; }
        
    [JsonProperty("cast_time")]
    public string CastTime { get; set; }
}