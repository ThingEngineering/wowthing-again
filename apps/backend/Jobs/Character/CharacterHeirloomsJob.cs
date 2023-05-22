﻿using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterHeirloomsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/heirlooms";
    public override async Task Run(params string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        if (query?.AccountId == null)
        {
            throw new InvalidDataException("AccountId is null");
        }

        string lockKey = $"character_heirlooms:{query.AccountId}";
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
        var uri = GenerateUri(query, ApiPath);
        try
        {
            var result = await GetJson<ApiCharacterHeirlooms>(uri, useLastModified: false);
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
        var heirlooms = await Context.PlayerAccountHeirlooms.FindAsync(query.AccountId.Value);
        if (heirlooms == null)
        {
            heirlooms = new PlayerAccountHeirlooms
            {
                AccountId = query.AccountId.Value,
            };
            Context.PlayerAccountHeirlooms.Add(heirlooms);
        }

        heirlooms.Heirlooms = resultData.Heirlooms
            .EmptyIfNull()
            .ToDictionary(
                heirloom => heirloom.Heirloom.Id,
                heirloom => heirloom.Upgrade.Level
            );

        int updated = await Context.SaveChangesAsync();
        if (updated > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, query.UserId);
        }

        await JobRepository.ReleaseLockAsync(lockKey, lockValue);
    }
}
