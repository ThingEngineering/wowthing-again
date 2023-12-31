using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterSpecializationsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/specializations";

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        // Fetch API data
        ApiCharacterSpecializations resultData;
        var uri = GenerateUri(query, ApiPath);
        try
        {
            var result = await GetJson<ApiCharacterSpecializations>(uri, useLastModified: false);
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
        specs.Specializations = new();
        foreach (var specData in resultData.Specializations ?? new List<ApiCharacterSpecializationsSpecialization>())
        {
            var spec = new PlayerCharacterSpecializationsSpecialization();

            foreach (var pvpTalent in specData.PvpTalents ?? new List<ApiCharacterSpecializationsPvpTalent>())
            {
                if (pvpTalent.Selected?.SpellTooltip?.Spell?.Id != null)
                {
                    spec.PvpTalents.Add(new List<int>
                    {
                        pvpTalent.SlotNumber,
                        pvpTalent.Selected.SpellTooltip.Spell.Id,
                    });
                }
            }

            foreach (var talent in specData.Talents ?? new List<ApiCharacterSpecializationsTalent>())
            {
                if (talent.SpellTooltip?.Spell?.Id != null)
                {
                    spec.Talents.Add(new List<int>
                    {
                        talent.TierIndex,
                        talent.ColumnIndex,
                        talent.SpellTooltip.Spell.Id,
                    });
                }
            }

            if (specData.Specialization?.Id != null)
            {
                specs.Specializations[specData.Specialization.Id] = spec;
            }
        }

        int updated = await Context.SaveChangesAsync();
        if (updated > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedGeneral, query.UserId);
        }
    }
}
