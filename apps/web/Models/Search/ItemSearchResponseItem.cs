namespace Wowthing.Web.Models.Search;

public class ItemSearchResponseItem
{
    public int ItemId { get; set; }
    public string ItemName { get; set; }

    public List<ItemSearchResponseCharacter> Characters { get; set; }
    public List<ItemSearchResponseCharacter> Equipped { get; set; }
    public List<ItemSearchResponseWarbank> Warbank { get; set; }

    public List<ItemSearchResponseGuildBank> GuildBanks { get; set; }
}
