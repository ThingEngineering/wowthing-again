using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceDeleteOldAuctionTablesJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceDeleteOldAuctionTables,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 2,
    };

    private const string SelectQuery = @"
SELECT  table_name
FROM    information_schema.tables
WHERE   table_schema = 'public'
        AND table_name LIKE 'wow_auction_%'
";

    public override async Task Run(string[] data)
    {
        await using var connection = Context.GetConnection();
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();

        var tableMap = new Dictionary<string, List<string>>();

        command.CommandText = SelectQuery;
        await using (var reader = await command.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                string tableName = reader.GetString(0);
                string[] parts = tableName.Split('_');

                // Don't drop the cheapest tables
                if (parts.Length != 4 || !char.IsDigit(parts[2][0]) || !char.IsDigit(parts[3][0]))
                {
                    continue;
                }

                if (!tableMap.TryGetValue(parts[2], out var tableList))
                {
                    tableList = tableMap[parts[2]] = new();
                }
                tableList.Add(tableName);
            }
        }

        int dropped = 0;
        foreach (var tableNames in tableMap.Values.Where(tableNames => tableNames.Count > 1))
        {
            var sortedNames = tableNames.OrderDescending();
            foreach (string tableName in sortedNames.Skip(1))
            {
                Logger.Debug("Dropping {table}", tableName);

                command.CommandText = $"DROP TABLE {tableName}";
                await command.ExecuteNonQueryAsync();

                dropped++;
            }
        }

        if (dropped > 0)
        {
            Logger.Information("Dropped {count} table(s)", dropped);
        }
    }
}
