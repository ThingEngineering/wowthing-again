using System.Net.Http;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}";
    private readonly Regex _numberRegex = new Regex(@"\d", RegexOptions.Compiled);

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        // Skip invalid character names
        if (_numberRegex.IsMatch(query.CharacterName))
        {
            await Context.PlayerCharacter
                .Where(c => c.Id == query.CharacterId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(pc => pc.ShouldUpdate, pc => false)
                );
            return;
        }

        // Get character from API
        var uri = GenerateUri(query, ApiPath);
        ApiCharacter apiCharacter;
        DateTime lastModified;
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacter>(uri, useLastModified: true, lastModified: query.LastApiModified);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            apiCharacter = result.Data;
            lastModified = result.LastModified;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);

            // Forbidden and NotFound are both treated as "ignore this character until the user
            // refreshes their character list"
            if (e.Message is "403" or "404")
            {
                await Context.PlayerCharacter
                    .Where(c => c.Id == query.CharacterId)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(pc => pc.ShouldUpdate, pc => false)
                    );
            }

            return;
        }

        // Get character from database
        var character = await Context.PlayerCharacter.FindAsync(query.CharacterId);
        if (character == null)
        {
            // This shouldn't be possible
            throw new InvalidOperationException("Character does not exist?!");
        }

        character.ActiveSpecId = apiCharacter.ActiveSpec?.Id ?? 0;
        character.ActiveTitleId = apiCharacter.ActiveTitle?.Id ?? 0;
        character.AverageItemLevel = apiCharacter.AverageItemLevel;
        character.ClassId = apiCharacter.Class.Id;
        character.EquippedItemLevel = apiCharacter.EquippedItemLevel;
        character.Experience = apiCharacter.Experience;
        character.Faction = apiCharacter.Faction.EnumParse<WowFaction>();
        character.Gender = apiCharacter.Gender.EnumParse<WowGender>();
        character.Level = apiCharacter.Level;
        character.Name = apiCharacter.Name;
        character.RaceId = apiCharacter.Race.Id;
        character.RealmId = apiCharacter.Realm.Id;

        character.LastApiModified = lastModified;
        character.ShouldUpdate = true;

        int updated = await Context.SaveChangesAsync();

        // Character changed, queue some more stuff
        var jobs = new List<JobType>();

        if (apiCharacter.AchievementsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterAchievements);
            jobs.Add(JobType.CharacterAchievementStatistics);
        }

        if (apiCharacter.CollectionsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterMounts);
        }

        // Replaced with addon data but use as fallback/initial load
        if (apiCharacter.EquipmentLink?.Href != null)
        {
            jobs.Add(JobType.CharacterEquipment);
        }

        if (apiCharacter.MediaLink?.Href != null)
        {
            jobs.Add(JobType.CharacterMedia);
        }

        // WTF: this exists even on lower level characters
        if (character.Level >= 50 && apiCharacter.MythicKeystoneProfileLink?.Href != null)
        {
            jobs.Add(JobType.CharacterMythicKeystoneProfile);
        }

        if (apiCharacter.ProfessionsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterProfessions);
        }

        if (apiCharacter.QuestsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterQuestsCompleted);
        }

        if (apiCharacter.ReputationsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterReputations);
        }

        if (apiCharacter.StatisticsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterStats);
        }

        if (apiCharacter.SpecializationsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterSpecializations);
        }

        // jobs.Add(JobType.CharacterTransmogs);

        // Shadowlands specific
        if (apiCharacter.CovenantProgress?.SoulbindsLink?.Href != null)
        {
            jobs.Add(JobType.CharacterSoulbinds);
        }

        // Account stuff
        if (query.AccountId.HasValue)
        {
            jobs.Add(JobType.CharacterHeirlooms);
            jobs.Add(JobType.CharacterPets);
            jobs.Add(JobType.CharacterToys);
        }

        var db = Redis.GetDatabase();
        await db.StringSetAsync(string.Format(RedisKeys.CharacterJobCounter, character.Id), jobs.Count);
        Logger.Debug("Character {id} job count is {value}", CharacterId, jobs.Count);

        foreach (var jobType in jobs)
        {
            await JobRepository.AddJobAsync(JobPriority.Low, jobType, data);
        }
    }
}
