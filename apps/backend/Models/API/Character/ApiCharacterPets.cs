namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterPets
{
    public List<ApiCharacterPet> Pets { get; set; }
}

public class ApiCharacterPet
{
    public long Id { get; set; }
    public int Level { get; set; }
    public ApiCharacterPetStats Stats { get; set; }
    public ApiObnoxiousObject Species { get; set; }
    public ApiTypeName Quality { get; set; }
}

public class ApiCharacterPetStats
{
    [JsonPropertyName("breed_id")]
    public int BreedId { get; set; }
}
