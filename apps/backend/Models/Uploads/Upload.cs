namespace Wowthing.Backend.Models.Uploads;

public class Upload
{
    public int Version { get; set; }
    public string BattleTag { get; set; }

    [JsonProperty("chars")]
    public Dictionary<string, UploadCharacter> Characters { get; set; }
        
    public Dictionary<string, UploadGuild> Guilds { get; set; }
        
    public List<int> Toys { get; set; }
        
    [JsonProperty("transmogSourcesV2")]
    public Dictionary<string, bool> TransmogSources { get; set; }
}