using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserCharacterMythicPlus
{
    public int CurrentPeriodId { get; }
    public Dictionary<int, Dictionary<int, List<PlayerCharacterMythicPlusRun>>> RawSeasons { get; }

    public ApiUserCharacterMythicPlus(PlayerCharacterMythicPlus mythicPlus, List<PlayerCharacterMythicPlusSeason> seasons, bool anon)
    {
        CurrentPeriodId = mythicPlus.CurrentPeriodId;
        RawSeasons = seasons
            .EmptyIfNull()
            .ToDictionary(season => season.Season, season => season.Runs
                .EmptyIfNull()
                .GroupBy(run => run.DungeonId)
                .ToDictionary(group => group.Key, group => group.OrderByDescending(r => r.Timed).ToList())
            );

        // if (anon)
        // {
        //     var allRuns = PeriodRuns.Values
        //         .SelectMany(x => x)
        //         .Concat(
        //             Seasons.Values
        //                 .SelectMany(x => x.Values.SelectMany(y => y))
        //         );
        //
        //     foreach (var run in allRuns)
        //     {
        //         run.Members = run.Members
        //             .EmptyIfNull()
        //             .Select(orig => new PlayerCharacterMythicPlusRunMember()
        //             {
        //                 ItemLevel = orig.ItemLevel,
        //                 Name = "SecretGoose",
        //                 RealmId = 0,
        //                 SpecializationId = orig.SpecializationId,
        //             })
        //             .ToList();
        //     }
        // }
    }
}
