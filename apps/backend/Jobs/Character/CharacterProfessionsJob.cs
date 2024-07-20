﻿using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterProfessionsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/professions";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        // Fetch API data
        ApiCharacterProfessions resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterProfessions>(uri, useLastModified: false);
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
        var professions = await Context.PlayerCharacterProfessions.FindAsync(_query.CharacterId);
        if (professions == null)
        {
            professions = new PlayerCharacterProfessions
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterProfessions.Add(professions);
        }

        professions.Professions = new();
        professions.ProfessionSpecializations = new();

        // Parse API data
        foreach (var dataProfession in resultData.All)
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

            if (dataProfession.Specialization != null)
            {
                professions.ProfessionSpecializations[dataProfession.Profession.Id] =
                    dataProfession.Specialization.Name;
            }
        }

        await Context.SaveChangesAsync();
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
