namespace Wowthing.Backend.Models.Uploads;

public class Upload
{
    public int Version { get; set; }
    public string BattleTag { get; set; }

    public short HonorCurrent { get; set; }
    public short HonorLevel { get; set; }
    public short HonorMax { get; set; }

    public Dictionary<long, string> BattlePets { get; set; }

    [JsonPropertyName("chars")]
    public Dictionary<string, UploadCharacter> Characters { get; set; }

    public Dictionary<string, UploadGuild> Guilds { get; set; }

    [JsonPropertyName("heirloomsV2")]
    public List<string> Heirlooms { get; set; }

    public Dictionary<int, string> Decor { get; set; }
    public List<int> Illusions { get; set; }
    public List<int> Quests { get; set; }
    public Dictionary<int, int> QuestsV2 { get; set; }
    public Dictionary<string, int> ScanTimes { get; set; }
    public List<int> Toys { get; set; }

    public Dictionary<short, List<string>> TransferCurrencies { get; set; }

    public string TransmogIdsSquish { get; set; }

    [JsonPropertyName("transmogSourcesV2")]
    public Dictionary<string, bool> TransmogSources { get; set; }

    public Dictionary<string, string> TransmogSourcesSquish { get; set; }
    public string TransmogSourcesSquishV2 { get; set; }

    public UploadWarbank Warbank { get; set; }
}
