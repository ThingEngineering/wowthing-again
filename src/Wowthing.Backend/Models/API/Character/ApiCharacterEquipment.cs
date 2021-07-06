using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Character
{
    public class ApiCharacterEquipment
    {
        [JsonProperty("equipped_items")]
        public List<ApiCharacterEquipmentItem> Items { get; set; }
    }

    public class ApiCharacterEquipmentItem
    {
        public int Context { get; set; }
        public ApiObnoxiousObject Item { get; set; }
        public ApiTypeName Quality { get; set; }
        public ApiTypeName Slot { get; set; }
        public ApiValueDisplay Level { get; set; }

        [JsonProperty("bonus_list")]
        public List<int> BonusList { get; set; }

        public List<ApiCharacterEquipmentItemEnchantment> Enchantments { get; set; }
    }

    public class ApiCharacterEquipmentItemEnchantment
    {
        [JsonProperty("enchantment_id")]
        public int Id { get; set; }
    }
}
