using Wowthing.Lib.Enums;

namespace Wowthing.Web.Models.Search;

public class ItemSearchResponseGuildBank
{
    public int GuildId { get; set; }
    public short Tab { get; set; }
    public short Slot { get; set; }

    public int Count { get; set; }
    public short ItemLevel { get; set; }
    public short Quality { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public short? Context { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public short? EnchantId { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public short? SuffixId { get; set; }

    public List<short> BonusIds { get; set; }
    public List<int> Gems { get; set; }
}
