using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterSpecializationsJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/specializations";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var uri = GenerateUri(query, ApiPath);
            var result = await GetJson<ApiCharacterSpecializations>(uri);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var specs = await Context.PlayerCharacterSpecializations.FindAsync(query.CharacterId);
            if (specs == null)
            {
                specs = new PlayerCharacterSpecializations
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterSpecializations.Add(specs);
            }

            // Parse API data
            specs.Specializations = result.Data.Specializations
                .ToDictionary(
                    spec => spec.Specialization.Id,
                    spec => new PlayerCharacterSpecializationsSpecialization
                    {
                        PvpTalents = spec.PvpTalents
                            .EmptyIfNull()
                            .Select(pvpTalent => new List<int>
                            {
                                pvpTalent.SlotNumber,
                                pvpTalent.Selected.SpellTooltip.Spell.Id,

                            })
                            .ToList(),

                        Talents = spec.Talents
                            .EmptyIfNull()
                            .Select(talent => new List<int>
                            {
                                talent.TierIndex,
                                talent.ColumnIndex,
                                talent.SpellTooltip.Spell.Id,
                            })
                            .ToList(),
                    }
                );

            await Context.SaveChangesAsync();
        }
    }
}
