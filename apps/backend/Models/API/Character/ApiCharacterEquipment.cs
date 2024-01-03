namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterEquipment
{
    [JsonPropertyName("equipped_items")]
    public List<ApiCharacterEquipmentItem> Items { get; set; }
}

public class ApiCharacterEquipmentItem
{
    public int Context { get; set; }
    public ApiObnoxiousObject Item { get; set; }
    public ApiTypeName Quality { get; set; }
    public ApiTypeName Slot { get; set; }
    public ApiValueDisplay Level { get; set; }

    [JsonPropertyName("bonus_list")]
    public List<int> BonusList { get; set; }

    public List<ApiCharacterEquipmentItemEnchantment> Enchantments { get; set; }
    public List<ApiCharacterEquipmentItemSocket> Sockets { get; set; }
}

public class ApiCharacterEquipmentItemEnchantment
{
    [JsonPropertyName("enchantment_id")]
    public int Id { get; set; }

    [JsonPropertyName("enchantment_slot")]
    public ApiTypeId Slot { get; set; }
}

public class ApiCharacterEquipmentItemSocket
{
    public ApiObnoxiousObject Item { get; set; }
}
