using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Serilog.Context;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            var path = string.Format(API_PATH, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            // Get character from database
            var character = await _context.PlayerCharacter.FindAsync(query.CharacterId);
            if (character == null)
            {
                // This shouldn't be possible
                throw new InvalidOperationException("Character does not exist?!");
            }

            ApiCharacter apiCharacter;
            try
            {
                // FIXME crappy hack for my main
                var result = await GetJson<ApiCharacter>(uri, useLastModified: character.Name != "Wataki" && character.Name != "Momokan");
                if (result.NotModified)
                {
                    _logger.Information("304 Not Modified");
                    return;
                }

                apiCharacter = result.Data;
            }
            catch (HttpRequestException e)
            {
                _logger.Error("HTTP {0}", e.Message);
                if (e.Message == "403")
                {
                    // 403s are pretty bad, seem to happen for characters on unsubscribed accounts
                    character.DelayHours += 24;
                }
                else
                {
                    // Treat every other error as relatively minor, try again later
                    // 404s are weird, can just mean "character hasn't logged in for a while"
                    character.DelayHours += 4;
                }
                
                await _context.SaveChangesAsync();

                return;
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

            await _context.SaveChangesAsync();

            // Character changed, queue some more stuff
            await _jobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterEquipment, data);
            await _jobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterMounts, data);
            await _jobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterQuestsCompleted, data);
            await _jobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterReputations, data);

            // API only has M+ data from BfA onwards
            if (character.Level >= 50)
            {
                await _jobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterMythicKeystoneProfile, data);
            }

            // Shadowlands specific
            if (character.Level >= 50)
            {
                await _jobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterSoulbinds, data);
            }

            // FIXME RaiderIO for max level people?
            if (character.Level == 60)
            {
                await _jobRepository.AddJobAsync(JobPriority.Low, JobType.CharacterRaiderIo, data);
            }
        }
    }
}
