﻿using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceDeleteWorldQuestReportsJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceDeleteWorldQuestReports,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 1,
    };

    private const string DeleteQuery = @"
DELETE FROM world_quest_report
WHERE   id IN (
    SELECT  id
    FROM    world_quest_report
    WHERE   (expires_at + '1 hour'::interval) < current_timestamp
    LIMIT   10000
)
";

    public override async Task Run(string[] data)
    {
        await using var connection = Context.GetConnection();
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = DeleteQuery;
        int deleted = await command.ExecuteNonQueryAsync();
        if (deleted > 0)
        {
            Logger.Information("Deleted {count} world quest report(s)", deleted);
        }
    }
}
