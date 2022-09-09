namespace Wowthing.Web.Models.Search;

public class ItemSearchResponseItem
{
    public int ItemId { get; set; }
    public string ItemName { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public List<ItemSearchResponseCharacter> Characters { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public List<ItemSearchResponseGuildBank> GuildBanks { get; set; }
}
