using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterStatsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/statistics";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        var timer = new JankTimer();

        // Fetch API data
        ApiCharacterStats resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterStats>(uri, useLastModified: false, timer: timer);
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
        var pcStats = await Context.PlayerCharacterStats.FindAsync(_query.CharacterId);
        if (pcStats == null)
        {
            pcStats = new PlayerCharacterStats
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterStats.Add(pcStats);
        }

        timer.AddPoint("Select");

        // Parse API data
        pcStats.Basic = new()
        {
            { WowItemStatType.Agility, resultData.Agility },
            { WowItemStatType.Armor, resultData.Armor },
            { WowItemStatType.Intellect, resultData.Intellect },
            { WowItemStatType.Stamina, resultData.Stamina },
            { WowItemStatType.Strength, resultData.Strength },
        };

        pcStats.Misc = new()
        {
            { WowItemStatType.AttackPower, resultData.AttackPower },
            { WowItemStatType.ExtraArmor, resultData.BonusArmor },
            { WowItemStatType.Health, resultData.Health },
            { WowItemStatType.Power, resultData.Power },
            { WowItemStatType.PowerType, resultData.PowerType?.Id ?? 0 },
            { WowItemStatType.SpellPower, resultData.SpellPower },
            { WowItemStatType.VersatilityRating, (int)resultData.Versatility },
            { WowItemStatType.VersatilityDamageDone, RoundToTwoPlaces(resultData.VersatilityDamageDoneBonus) },
            { WowItemStatType.VersatilityDamageTaken, RoundToTwoPlaces(resultData.VersatilityDamageTakenBonus) },
            { WowItemStatType.VersatilityHealingDone, RoundToTwoPlaces(resultData.VersatilityHealingDoneBonus) },
        };

        pcStats.Rating = new();

        if (resultData.Avoidance != null)
        {
            pcStats.Rating[WowItemStatType.AvoidanceRating] = resultData.Avoidance.ToPlayerCharacterStatsRating();
        }

        // if (resultData.Block != null)
        // {
            // pcStats.Rating[WowItemStatType.BlockRating] = resultData.Block.ToPlayerCharacterStatsRating();
        // }

        if (resultData.Dodge != null)
        {
            pcStats.Rating[WowItemStatType.DodgeRating] = resultData.Dodge.ToPlayerCharacterStatsRating();
        }

        if (resultData.Lifesteal != null)
        {
            pcStats.Rating[WowItemStatType.LifestealRating] = resultData.Lifesteal.ToPlayerCharacterStatsRating();
        }

        if (resultData.Mastery != null)
        {
            pcStats.Rating[WowItemStatType.MasteryRating] = resultData.Mastery.ToPlayerCharacterStatsRating();
        }

        if (resultData.MeleeCrit != null)
        {
            pcStats.Rating[WowItemStatType.CritMeleeRating] = resultData.MeleeCrit.ToPlayerCharacterStatsRating();
        }

        if (resultData.MeleeHaste != null)
        {
            pcStats.Rating[WowItemStatType.HasteMeleeRating] = resultData.MeleeHaste.ToPlayerCharacterStatsRating();
        }

        if (resultData.Parry != null)
        {
            pcStats.Rating[WowItemStatType.ParryRating] = resultData.Parry.ToPlayerCharacterStatsRating();
        }

        if (resultData.RangedCrit != null)
        {
            pcStats.Rating[WowItemStatType.CritRangedRating] = resultData.RangedCrit.ToPlayerCharacterStatsRating();
        }

        if (resultData.RangedHaste != null)
        {
            pcStats.Rating[WowItemStatType.HasteRangedRating] = resultData.RangedHaste.ToPlayerCharacterStatsRating();
        }

        if (resultData.Speed != null)
        {
            pcStats.Rating[WowItemStatType.SpeedRating] = resultData.Speed.ToPlayerCharacterStatsRating();
        }

        if (resultData.SpellCrit != null)
        {
            pcStats.Rating[WowItemStatType.CritSpellRating] = resultData.SpellCrit.ToPlayerCharacterStatsRating();
        }

        if (resultData.SpellHaste != null)
        {
            pcStats.Rating[WowItemStatType.HasteSpellRating] = resultData.SpellHaste.ToPlayerCharacterStatsRating();
        }

        timer.AddPoint("Process");

        await Context.SaveChangesAsync();

        timer.AddPoint("Update", true);
        Logger.Debug("{Timer}", timer.ToString());
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }

    private int RoundToTwoPlaces(decimal value)
    {
        return (int)Math.Round(value * 100);
    }
}
