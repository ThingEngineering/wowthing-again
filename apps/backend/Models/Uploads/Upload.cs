namespace Wowthing.Backend.Models.Uploads;

public class Upload
{
    public int Version { get; set; }
    public string BattleTag { get; set; }

    public short HonorCurrent { get; set; }
    public short HonorLevel { get; set; }
    public short HonorMax { get; set; }

    [JsonPropertyName("chars")]
    public Dictionary<string, UploadCharacter> Characters { get; set; }

    public Dictionary<string, UploadGuild> Guilds { get; set; }

    [JsonPropertyName("heirloomsV2")]
    public List<string> Heirlooms { get; set; }

    public List<int> Quests { get; set; }

    public List<int> Toys { get; set; }

    [JsonPropertyName("transmogSourcesV2")]
    public Dictionary<string, bool> TransmogSources { get; set; }
}
