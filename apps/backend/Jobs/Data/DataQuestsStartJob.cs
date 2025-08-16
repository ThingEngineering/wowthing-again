using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data;

public class DataQuestsStartJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.DataQuestsStart,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromMinutes(5),
        Version = 1,
    };

    public override async Task Run(string[] data)
    {
        var timer = new JankTimer();

        var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
        var quests = await Context.WowQuest
            .FromSqlInterpolated($@"
WITH quest_ids AS (
    SELECT  wq.id
    FROM    wow_quest wq
    WHERE   wq.last_api_check < {oneMonthAgo}
            AND NOT EXISTS (
                SELECT  1
                FROM    language_string ls
                WHERE   ls.language = {Language.enUS}
                        AND ls.type = {StringType.WowQuestName}
                        AND ls.id = wq.id
                        AND ls.string != '~PLACEHOLDER~'
            )
    ORDER BY wq.id
    FOR UPDATE SKIP LOCKED
    LIMIT   1000
)
UPDATE  wow_quest
SET     last_api_check = CURRENT_TIMESTAMP
WHERE   id = ANY(SELECT id FROM quest_ids)
RETURNING *
")
            .ToArrayAsync(CancellationToken);

        timer.AddPoint("Query");

        foreach (var quest in quests)
        {
            await JobRepository.AddJobAsync(
                JobPriority.Bulk,
                JobType.DataQuest,
                ((int)WowRegion.US).ToString(),
                quest.Id.ToString()
            );
        }

        timer.AddPoint("Iterate");

        await Context.SaveChangesAsync();

        timer.AddPoint("Save", true);

        Logger.Information(timer.ToString());
    }
}
