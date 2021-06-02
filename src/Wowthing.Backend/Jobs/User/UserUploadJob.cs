using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Wowthing.Backend.Models.Uploads;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User
{
    public class UserUploadJob : JobBase
    {
        public override async Task Run(params string[] data)
        {
            int userId = int.Parse(data[0]);
            using var shrug = UserLog(userId.ToString());

            _logger.Information("Processing upload...");

            var json = LuaToJsonConverter.Convert(data[1].Replace("WWTCSaved = ", ""));
            var parsed = JsonConvert.DeserializeObject<Upload[]>(json)[0]; // TODO work out why this is an array of objects

            // Fetch character data for this account
            var characterMap = await _context.PlayerCharacter
                .Where(c => c.Account.UserId == userId)
                .Include(c => c.Weekly)
                .ToDictionaryAsync(k => (k.RealmId, k.Name));

            var realmIds = characterMap.Values
                .Select(c => c.RealmId)
                .Distinct()
                .ToArray();
            var realmMap = await _context.WowRealm
                .ToDictionaryAsync(k => (k.Region, k.Name));

            int accountId = 0;

            // ?
            foreach (var (addonId, characterData) in parsed.Characters)
            {
                // US/Mal'Ganis/Fakenamehere
                var parts = addonId.Split("/");
                if (parts.Length != 3)
                {
                    continue;
                }

                var region = Enum.Parse<WowRegion>(parts[0]);
                if (!realmMap.TryGetValue((Enum.Parse<WowRegion>(parts[0]), parts[1]), out WowRealm realm))
                {
                    _logger.Warning("Invalid realm: {0}/{1}", parts[0], parts[1]);
                    continue;
                }

                if (!characterMap.TryGetValue((realm.Id, parts[2]), out PlayerCharacter character))
                {
                    _logger.Warning("Invalid character: {0}/{1}/{2}", parts[0], parts[1], parts[2]);
                    continue;
                }

                _logger.Information("Found character: {0} => {1}", addonId, character.Id);
                accountId = character.AccountId.Value;

                if (character.Weekly == null)
                {
                    character.Weekly = new PlayerCharacterWeekly
                    {
                        Character = character,
                    };
                    _context.PlayerCharacterWeekly.Add(character.Weekly);
                }

                character.Weekly.KeystoneDungeon = characterData.KeystoneInstance;
                character.Weekly.KeystoneLevel = characterData.KeystoneLevel;

                if (characterData.ScanTimes.TryGetValue("vault", out int vaultScanned) && characterData.MythicDungeons != null && characterData.Vault != null)
                {
                    character.Weekly.Vault.ScannedAt = DateTimeOffset.FromUnixTimeSeconds(vaultScanned).UtcDateTime;

                    character.Weekly.Vault.MythicPlusRuns = characterData.MythicDungeons
                        .Select(d => new List<int> { d.Map, d.Level })
                        .ToList();

                    // https://wowpedia.fandom.com/wiki/API_C_WeeklyRewards.GetActivities
                    character.Weekly.Vault.MythicPlusProgress = ConvertVault(characterData.Vault[0]);
                    character.Weekly.Vault.RankedPvpProgress = ConvertVault(characterData.Vault[1]);
                    character.Weekly.Vault.RaidProgress = ConvertVault(characterData.Vault[2]);

                    _context.Entry(character.Weekly).Property(e => e.Vault).IsModified = true;
                }
            }

            if (accountId > 0 && parsed.Toys != null)
            {
                var accountToys = _context.PlayerAccountToys.Find(accountId);
                if (accountToys == null)
                {
                    accountToys = new PlayerAccountToys
                    {
                        AccountId = accountId,
                    };
                    _context.PlayerAccountToys.Add(accountToys);
                } 
                accountToys.ToyIds = parsed.Toys.OrderBy(t => t).ToList();
            }

            await _context.SaveChangesAsync();
        }

        private static List<PlayerCharacterWeeklyVaultProgress> ConvertVault(UploadCharacterVault[] vault)
        {
            return vault
                .OrderBy(v => v.Threshold)
                .Select(v => new PlayerCharacterWeeklyVaultProgress
                {
                    Level = v.Level,
                    Progress = v.Progress,
                    Threshold = v.Threshold,
                })
                .ToList();
        }
    }
}
