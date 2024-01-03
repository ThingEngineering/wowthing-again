namespace Wowthing.Backend.Models.API.Profile;

public class ApiAccountProfile
{
    public long Id { get; set; }

    [JsonPropertyName("wow_accounts")]
    public List<ApiAccountProfileAccount> Accounts { get; set; }
}

public class ApiAccountProfileAccount
{
    public long Id { get; set; }

    public List<ApiAccountProfileCharacter> Characters { get; set; }
}

public class ApiAccountProfileCharacter
{
    public long Id { get; set; }
    public string Name { get; set; }
    public int Level { get; set; }
    public ApiObnoxiousObject Realm { get; set; }
    public ApiTypeName Faction { get; set; }
    public ApiTypeName Gender { get; set; }

    [JsonPropertyName("playable_class")]
    public ApiObnoxiousObject Class { get; set; }

    [JsonPropertyName("playable_race")]
    public ApiObnoxiousObject Race { get; set; }
}
