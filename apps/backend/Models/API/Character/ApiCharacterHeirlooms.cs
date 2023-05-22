namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterHeirlooms
{
    public List<ApiCharacterHeirloom> Heirlooms { get; set; }
}

public class ApiCharacterHeirloom
{
    public ApiObnoxiousObject Heirloom { get; set; }
    public ApiCharacterHeirloomUpgrade Upgrade { get; set; }
}

public class ApiCharacterHeirloomUpgrade
{
    public int Level { get; set; }
}
