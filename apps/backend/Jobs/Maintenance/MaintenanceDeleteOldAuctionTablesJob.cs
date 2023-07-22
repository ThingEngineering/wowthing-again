using Polly;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceDeleteOldAuctionTablesJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceDeleteOldAuctionTables,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(24),
        Version = 1,
    };

    private const string SelectQuery = @"
SELECT  table_name
FROM    information_schema.tables
WHERE   table_schema = 'public'
        AND table_name LIKE 'wow_auction_%'
";

    public override async Task Run(params string[] data)
    {
        await using var connection = Context.GetConnection();
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();

        string minDate = DateTime.UtcNow.AddMonths(-1).ToString("yyyyMMddHHmmss");
        var deleteMe = new List<string>();

        command.CommandText = SelectQuery;
        await using (var reader = await command.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                string tableName = reader.GetString(0);
                string[] parts = tableName.Split('_');
                if (string.Compare(parts[3], minDate, StringComparison.Ordinal) < 0)
                {
                    deleteMe.Add(tableName);
                    Logger.Information("{min} > {table}", tableName, minDate);
                }
            }
        }

        if (deleteMe.Count > 0)
        {
            foreach (string tableName in deleteMe)
            {
                command.CommandText = $"DROP TABLE {tableName}";
                await command.ExecuteNonQueryAsync();
            }

            Logger.Information("Dropped {count} table(s)", deleteMe.Count);
        }
    }
}
