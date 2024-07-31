namespace Wowthing.Backend.Models.API.Data;

public class ApiDataAuctions
{
    public List<ApiDataAuctionsAuction> Auctions { get; set; }
}

public class ApiDataAuctionsAuction
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public long Buyout { get; set; }
    public long Bid { get; set; }

    [JsonPropertyName("unit_price")]
    public long UnitPrice { get; set; }

    [JsonPropertyName("time_left")]
    public string TimeLeft { get; set; }

    public ApiDataAuctionsAuctionItem Item { get; set; }
}

public class ApiDataAuctionsAuctionItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    public short Context { get; set; }

    [JsonPropertyName("pet_breed_id")]
    public short PetBreedId { get; set; }

    [JsonPropertyName("pet_level")]
    public short PetLevel { get; set; }

    [JsonPropertyName("pet_quality_id")]
    public short PetQualityId { get; set; }

    [JsonPropertyName("pet_species_id")]
    public short PetSpeciesId { get; set; }

    [JsonPropertyName("bonus_lists")]
    public List<int> BonusLists { get; set; }

    public List<ApiTypeValue<short, int>> Modifiers { get; set; }
}
