using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterHeirloomsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/heirlooms";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        if (_query?.AccountId == null)
        {
            throw new InvalidDataException("AccountId is null");
        }

        string lockKey = $"character_heirlooms:{_query.AccountId}";
        string lockValue = Guid.NewGuid().ToString("N");
        try
        {
            // Attempt to get exclusive scheduler lock
            bool lockSuccess = await JobRepository.AcquireLockAsync(lockKey, lockValue, TimeSpan.FromMinutes(1));
            if (!lockSuccess)
            {
                Logger.Debug("Skipping heirlooms, lock failed");
                return;
            }
        }
        catch (Exception ex)
        {
            Logger.Error(ex, "Kaboom!");
            return;
        }

        // Fetch API data
        ApiCharacterHeirlooms resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterHeirlooms>(uri, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        // Fetch character data
        var heirlooms = await Context.PlayerAccountHeirlooms.FindAsync(_query.AccountId.Value);
        if (heirlooms == null)
        {
            heirlooms = new PlayerAccountHeirlooms
            {
                AccountId = _query.AccountId.Value,
            };
            Context.PlayerAccountHeirlooms.Add(heirlooms);
        }

        heirlooms.Heirlooms = resultData.Heirlooms
            .EmptyIfNull()
            .ToDictionary(
                heirloom => heirloom.Heirloom.Id,
                heirloom => heirloom.Upgrade.Level
            );

        await Context.SaveChangesAsync();

        await JobRepository.ReleaseLockAsync(lockKey, lockValue);
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
