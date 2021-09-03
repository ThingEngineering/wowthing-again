using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Get character from API
            var uri = GenerateUri(query, ApiPath);
            ApiCharacter apiCharacter;
            try
            {
                var result = await GetJson<ApiCharacter>(uri, useLastModified: true);
                if (result.NotModified)
                {
                    LogNotModified();

                    await Context.BatchUpdate<PlayerCharacter>()
                        .Set(c => c.DelayHours, c => 0)
                        .Where(c => c.Id == query.CharacterId)
                        .ExecuteAsync();

                    return;
                }

                apiCharacter = result.Data;
            }
            catch (HttpRequestException e)
            {
                Logger.Error("HTTP {0}", e.Message);

                var delayHoursIncrement = 0;
                if (e.Message == "403")
                {
                    // 403s are pretty bad, seem to happen for characters on unsubscribed accounts
                    delayHoursIncrement = 24;
                }
                else
                {
                    // Treat every other error as relatively minor, try again later
                    // 404s are weird, can just mean "character hasn't logged in for a while"
                    delayHoursIncrement = 4;
                }

                await Context.BatchUpdate<PlayerCharacter>()
                    .Set(c => c.DelayHours, c => c.DelayHours + delayHoursIncrement)
                    .Where(c => c.Id == query.CharacterId)
                    .ExecuteAsync();

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
            character.GuildId = apiCharacter.Guild?.Id ?? 0;
            character.Level = apiCharacter.Level;
            character.Name = apiCharacter.Name;
            character.RaceId = apiCharacter.Race.Id;
            character.RealmId = apiCharacter.Realm.Id;

            character.DelayHours = 0;

            await Context.SaveChangesAsync();

            // Character changed, queue some more stuff
            var jobs = new List<JobType>();

            if (apiCharacter.AchievementsLink?.Href != null)
            {
                jobs.Add(JobType.CharacterAchievements);
            }

            if (apiCharacter.CollectionsLink?.Href != null)
            {
                jobs.Add(JobType.CharacterMounts);
            }

            if (apiCharacter.EquipmentLink?.Href != null)
            {
                jobs.Add(JobType.CharacterEquipment);
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

            // Shadowlands specific
            if (apiCharacter.CovenantProgress?.SoulbindsLink?.Href != null)
            {
                jobs.Add(JobType.CharacterSoulbinds);
            }
            
            // Pets
            if (query.AccountId.HasValue)
            {
                jobs.Add(JobType.CharacterPets);
            }

            foreach (var jobType in jobs)
            {
                await JobRepository.AddJobAsync(JobPriority.Low, jobType, data);
            }
        }
    }
}
