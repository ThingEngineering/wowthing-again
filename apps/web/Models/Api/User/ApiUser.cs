using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Global;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Models.Api.User;

public class ApiUser
{
    public DateTime? LastApiCheck { get; set; }
    public bool Public { get; init; }

    public Dictionary<int, ApiUserAccount> Accounts { get; init; }

    [JsonPropertyName("charactersRaw")]
    public List<ApiUserCharacter> Characters { get; init; }

    [JsonPropertyName("guildsRaw")]
    public List<ApiUserGuild> Guilds { get; set; }

    public List<int> GoldHistoryRealms { get; set; }

    public short HonorCurrent { get; set; }
    public short HonorLevel { get; set; }
    public short HonorMax { get; set; }
    public int WarbankGold { get; set; }
    public DateTimeOffset? WarbankScannedAt { get; set; }

    public Dictionary<int, WowPeriod> CurrentPeriod { get; init; }
    public Dictionary<int, List<int>> Decor { get; set; }
    public Dictionary<string, GlobalDailies> GlobalDailies { get; set; }
    public Dictionary<int, int> Heirlooms { get; set; }
    public Dictionary<string, string> Images { get; set; }
    public Dictionary<int, RedisRaiderIoScoreTiers> RaiderIoScoreTiers { get; set; }
    public PlayerWarbankItem[] RawWarbankItems { get; set; }

    public Dictionary<int, List<UserPetDataPet>> PetsRaw { get; set; }

    public string MountsPacked { get; init; }
    public string ToysPacked { get; init; }

    public List<short> IllusionIds { get; set; }
    public List<int> RawAppearanceIds { get; set; }
    public Dictionary<int, List<int>> RawAppearanceSources { get; set; }
}
