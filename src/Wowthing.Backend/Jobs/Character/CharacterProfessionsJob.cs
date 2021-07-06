using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterProfessionsJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/professions";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var path = string.Format(ApiPath, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterProfessions>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var professions = await Context.PlayerCharacterProfessions.FindAsync(query.CharacterId);
            if (professions == null)
            {
                professions = new PlayerCharacterProfessions
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterProfessions.Add(professions);
            }

            professions.Professions = new Dictionary<int, Dictionary<int, PlayerCharacterProfessionTier>>();

            // Parse API data
            foreach (var dataProfession in result.Data.All)
            {
                var profession = professions.Professions[dataProfession.Profession.Id] = new Dictionary<int, PlayerCharacterProfessionTier>();

                // Special case for Archaeology only, kinda weird
                if (dataProfession.MaxSkillPoints.HasValue && dataProfession.SkillPoints.HasValue)
                {
                    profession[dataProfession.Profession.Id] = new PlayerCharacterProfessionTier
                    {
                        CurrentSkill = dataProfession.SkillPoints.Value,
                        MaxSkill = dataProfession.MaxSkillPoints.Value,
                        KnownRecipes = new List<int>(),
                    };
                }
                else
                {
                    foreach (var dataTier in dataProfession.Tiers.EmptyIfNull())
                    {
                        profession[dataTier.Tier.Id] = new PlayerCharacterProfessionTier
                        {
                            CurrentSkill = dataTier.SkillPoints,
                            MaxSkill = dataTier.MaxSkillPoints,
                            KnownRecipes = dataTier.KnownRecipes
                                .EmptyIfNull()
                                .Select(kr => kr.Id)
                                .ToList(),
                        };
                    }
                }
            }

            await Context.SaveChangesAsync();
        }
    }
}
