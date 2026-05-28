using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterMountsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/mounts";

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

        int accountId = _query.AccountId.Value;

        string lockKey = $"account_mounts:{accountId}";
        string lockValue = Guid.NewGuid().ToString("N");
        try
        {
            // Attempt to get exclusive scheduler lock
            bool lockSuccess = await JobRepository.AcquireLockAsync(lockKey, lockValue, TimeSpan.FromMinutes(1));
            if (!lockSuccess)
            {
                Logger.Debug("Skipping pets, lock failed");
                return;
            }
        }
        catch (Exception ex)
        {
            Logger.Error(ex, "Kaboom!");
            return;
        }

        // Fetch API data
        ApiCharacterMounts resultData;
        var uri = GenerateUri(_query, ApiPath);
        try {
            var result = await GetUriAsJsonAsync<ApiCharacterMounts>(uri, useLastModified: false);
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
        var paMounts = await Context.PlayerAccountMounts.FindAsync(accountId);
        if (paMounts == null)
        {
            paMounts = new PlayerAccountMounts(accountId);
            Context.PlayerAccountMounts.Add(paMounts);
        }

        var apiMounts = resultData.Mounts
            .Select(mount => mount.Mount.Id);

        var allMounts = paMounts.MountIds.EmptyIfNull()
            .Concat(apiMounts)
            .OrderBy(mountId => mountId)
            .Distinct()
            .ToList();

        if (paMounts.MountIds == null || !allMounts.SequenceEqual(paMounts.MountIds))
        {
            paMounts.MountIds = allMounts;
            paMounts.UpdatedAt = DateTime.UtcNow;

            await Context.SaveChangesAsync(CancellationToken);
        }

        await JobRepository.ReleaseLockAsync(lockKey, lockValue);
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
