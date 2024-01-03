using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterStats
{
    public decimal MainHandDamageMax { get; set; }
    public decimal MainHandDamageMin { get; set; }
    public decimal MainHandDps { get; set; }
    public decimal MainHandSpeed { get; set; }
    public decimal ManaRegen { get; set; }
    public decimal ManaRegenCombat { get; set; }
    public decimal OffHandDps { get; set; }
    public decimal OffHandDamageMax { get; set; }
    public decimal OffHandDamageMin { get; set; }
    public decimal OffHandSpeed { get; set; }
    public decimal Versatility { get; set; }
    [JsonPropertyName("versatility_damage_done_bonus")]
    public decimal VersatilityDamageDoneBonus { get; set; }
    [JsonPropertyName("versatility_damage_taken_bonus")]
    public decimal VersatilityDamageTakenBonus { get; set; }
    [JsonPropertyName("versatility_healing_done_bonus")]
    public decimal VersatilityHealingDoneBonus { get; set; }
    [JsonPropertyName("attack_power")]
    public int AttackPower { get; set; }
    [JsonPropertyName("bonus_armor")]
    public int BonusArmor { get; set; }
    public int Health { get; set; }
    public int Power { get; set; }
    [JsonPropertyName("spell_power")]
    public int SpellPower { get; set; }
    [JsonPropertyName("power_type")]
    public ApiObnoxiousObject PowerType { get; set; }

    public PlayerCharacterStatsBasic Agility { get; set; }
    public PlayerCharacterStatsBasic Armor { get; set; }
    public PlayerCharacterStatsBasic Intellect { get; set; }
    public PlayerCharacterStatsBasic Stamina { get; set; }
    public PlayerCharacterStatsBasic Strength { get; set; }

    public ApiCharacterStatsRating Avoidance { get; set; }
    public ApiCharacterStatsRating Block { get; set; }
    public ApiCharacterStatsRating Dodge { get; set; }
    public ApiCharacterStatsRating Lifesteal { get; set; }
    public ApiCharacterStatsRating Mastery { get; set; }
    [JsonPropertyName("melee_crit")]
    public ApiCharacterStatsRating MeleeCrit { get; set; }
    [JsonPropertyName("melee_haste")]
    public ApiCharacterStatsRating MeleeHaste { get; set; }
    public ApiCharacterStatsRating Parry { get; set; }
    [JsonPropertyName("ranged_crit")]
    public ApiCharacterStatsRating RangedCrit { get; set; }
    [JsonPropertyName("ranged_haste")]
    public ApiCharacterStatsRating RangedHaste { get; set; }
    public ApiCharacterStatsRating Speed { get; set; }
    [JsonPropertyName("spell_crit")]
    public ApiCharacterStatsRating SpellCrit { get; set; }
    [JsonPropertyName("spell_haste")]
    public ApiCharacterStatsRating SpellHaste { get; set; }
}

public class ApiCharacterStatsRating
{
    public int Rating { get; set; }
    [JsonPropertyName("rating_bonus")]
    public decimal RatingBonus { get; set; }
    public decimal? Value { get; set; }

    public PlayerCharacterStatsRating ToPlayerCharacterStatsRating()
    {
        return new PlayerCharacterStatsRating()
        {
            Rating = Rating,
            RatingBonus = (int)Math.Round(RatingBonus * 100),
            Value = Value.HasValue ? (int)Math.Round(Value.Value * 100) : null,
        };
    }
}
