using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<CharacterQuery>(data[0]);

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
                apiCharacter = await GetJson<ApiCharacter>(uri, lastModified: query.LastModified);
            }
            catch (HttpRequestException e)
            {
                if (e.Message != "304")
                {
                    _logger.Error("{0}: character {1}/{2}", e.Message, query.RealmSlug, query.CharacterName.ToLowerInvariant());
                }

                if (e.Message == "403")
                {
                    // 403s are pretty bad, seem to happen for characters on unsubscribed accounts
                    character.DelayHours += 24;
                }
                else
                {
                    // Treat every other error as relatively minor, try again later
                    // 404s are weird, can just mean "character hasn't logged in for a while"
                    character.DelayHours += 1;
                }
                
                await _context.SaveChangesAsync();

                return;
            }

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
            character.LastModified = DateTimeOffset.FromUnixTimeMilliseconds(apiCharacter.LastLogout).UtcDateTime;

            await _context.SaveChangesAsync();
        }
    }
}
