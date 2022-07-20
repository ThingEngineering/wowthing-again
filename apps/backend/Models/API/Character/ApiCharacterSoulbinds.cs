namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterSoulbinds
{
    [JsonProperty("chosen_covenant")]
    public ApiObnoxiousObject ChosenCovenant { get; set; }
        
    [JsonProperty("renown_level")]
    public int RenownLevel { get; set; }

    public List<ApiCharacterSoulbindsSoulbind> Soulbinds { get; set; }
}

public class ApiCharacterSoulbindsSoulbind
{
    [JsonProperty("is_active")]
    public bool IsActive { get; set; }

    public ApiObnoxiousObject Soulbind { get; set; }
    public List<ApiCharacterSoulbindsTraitOrConduit> Traits { get; set; }
}

public class ApiCharacterSoulbindsTraitOrConduit
{
    public int Tier { get; set; }

    [JsonProperty("conduit_socket")]
    public ApiCharacterSoulbindsConduit Conduit { get; set; }
    public ApiObnoxiousObject Trait { get; set; }
}

public class ApiCharacterSoulbindsConduit
{
    public ApiCharacterSoulbindsConduitSocket Socket { get; set; }
    public ApiTypeName Type { get; set; }
}

public class ApiCharacterSoulbindsConduitSocket
{
    public ApiObnoxiousObject Conduit { get; set; }
    public int Rank { get; set; }
}