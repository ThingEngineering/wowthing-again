using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.Uploads;

public class Upload
{
    public int Version { get; set; }
    public string BattleTag { get; set; }

    public short HonorCurrent { get; set; }
    public short HonorLevel { get; set; }
    public short HonorMax { get; set; }

    [JsonProperty("chars")]
    [JsonPropertyName("chars")]
    public Dictionary<string, UploadCharacter> Characters { get; set; }

    public Dictionary<string, UploadGuild> Guilds { get; set; }

    [JsonProperty("heirloomsV2")]
    [JsonPropertyName("heirloomsV2")]
    public List<string> Heirlooms { get; set; }

    public List<int> Quests { get; set; }

    public List<int> Toys { get; set; }

    [JsonProperty("transmogSourcesV2")]
    [JsonPropertyName("transmogSourcesV2")]
    public Dictionary<string, bool> TransmogSources { get; set; }
}
