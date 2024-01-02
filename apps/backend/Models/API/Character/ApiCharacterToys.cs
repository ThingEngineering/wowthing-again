namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterToys
{
    public List<ApiCharacterToy> Toys { get; set; }
}

public class ApiCharacterToy
{
    public ApiObnoxiousObject Toy { get; set; }

    [JsonPropertyName("is_favorite")]
    public bool IsFavorite { get; set; }
}
