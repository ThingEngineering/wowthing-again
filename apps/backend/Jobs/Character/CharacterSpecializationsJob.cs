using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterSpecializationsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/specializations";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterSpecializations resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterSpecializations>(uri, useLastModified: false);
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
        var specs = await Context.PlayerCharacterSpecializations.FindAsync(_query.CharacterId);
        if (specs == null)
        {
            specs = new PlayerCharacterSpecializations
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterSpecializations.Add(specs);
        }

        // Parse API data
        specs.Specializations = new();
        foreach (var apiSpec in resultData.Specializations ?? new List<ApiCharacterSpecializationsSpecialization>())
        {
            var dbSpec = new PlayerCharacterSpecializationsSpecialization();

            foreach (var pvpTalent in apiSpec.PvpTalents ?? new List<ApiCharacterSpecializationsPvpTalent>())
            {
                if (pvpTalent.Selected?.SpellTooltip?.Spell?.Id != null)
                {
                    dbSpec.PvpTalents.Add(new List<int>
                    {
                        pvpTalent.SlotNumber,
                        pvpTalent.Selected.SpellTooltip.Spell.Id,
                    });
                }
            }

            if (apiSpec.Loadouts != null)
            {
                foreach (var apiLoadout in apiSpec.Loadouts)
                {
                    var dbLoadout = new PlayerCharacterSpecializationsSpecializationLoadout
                    {
                        Active = apiLoadout.IsActive,
                        HeroTreeId = apiLoadout?.HeroTree?.Id ?? 0,
                        LoadoutCode = apiLoadout.TalentLoadoutCode,
                    };
                    dbSpec.Loadouts.Add(dbLoadout);

                    foreach (var someTalents in new[] { apiLoadout.ClassTalents, apiLoadout.SpecTalents, apiLoadout.HeroTalents })
                    {
                        if (someTalents == null)
                        {
                            continue;
                        }

                        foreach (var someTalent in someTalents)
                        {
                            dbLoadout.Talents.Add([
                                someTalent.Id,
                                someTalent.Rank,
                                someTalent.Tooltip?.SpellTooltip?.Spell?.Id ?? 0,
                            ]);
                        }
                    }
                }
            }

            if (apiSpec.Specialization?.Id != null)
            {
                specs.Specializations[apiSpec.Specialization.Id] = dbSpec;
            }
        }

        await Context.SaveChangesAsync(CancellationToken);
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
