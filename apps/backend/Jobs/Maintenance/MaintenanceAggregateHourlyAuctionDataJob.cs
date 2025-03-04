using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Maintenance;

public class MaintenanceAggregateHourlyAuctionDataJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MaintenanceAggregateHourlyAuctionData,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromMinutes(1),
        Version = 1,
    };

    private static readonly Dictionary<short, string> RegionTimeZone = new()
    {
        { (short)WowRegion.US, "STD+07" },
        { (short)WowRegion.EU, "STD-01" },
    };

    private const string MinDateSql = """
                               SELECT COALESCE(MIN(DATE(timestamp AT TIME ZONE '{1}')), '2000-01-01') AS "Value"
                               FROM wow_auction_commodity_hourly
                               WHERE region = {0} AND
                                     DATE(timestamp AT TIME ZONE '{1}') < '{2}'
                               """;

    private const string DataSql = """
                                   SELECT *
                                   FROM wow_auction_commodity_hourly
                                   WHERE region = {0} AND
                                         DATE(timestamp AT TIME ZONE '{1}') = '{2}' AND
                                         listed >= 100
                                   """;

    private const string DeleteSql = """
                                     DELETE
                                     FROM wow_auction_commodity_hourly
                                     WHERE region = {0} AND
                                           DATE(timestamp AT TIME ZONE '{1}') = '{2}'
                                     """;

    public override async Task Run(string[] data)
    {
        var oneWeekAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7));
        var timer = new JankTimer();

        foreach (var (region, timeZone) in RegionTimeZone)
        {
            // Generating this query with SqlQuery() doesn't use the index for some reason
            string minDateQuery = string.Format(MinDateSql, region, timeZone, oneWeekAgo.ToString("yyyy-MM-dd"));
            // Logger.Debug(minDateQuery);
            var minDate = await Context.Database
                .SqlQueryRaw<DateOnly>(minDateQuery)
                .SingleAsync();

            timer.AddPoint("Min");

            if (minDate.Year > 2000)
            {
                var formattedDate = minDate.ToString("yyyy-MM-dd");

                // Generating this query with SqlQuery() doesn't use the index for some reason
                string dataQuery = string.Format(DataSql, region, timeZone, formattedDate);
                // Logger.Debug(dataQuery);
                var allRows = await Context.WowAuctionCommodityHourly
                    .FromSqlRaw(dataQuery)
                    .ToArrayAsync();
                Logger.Information("[{region} {date}] Aggregating data for {count} rows...",
                    ((WowRegion)region).ToString(), formattedDate, allRows.Length);

                var dailyMap = new Dictionary<int, WowAuctionCommodityDaily>();

                foreach (var row in allRows)
                {
                    if (!dailyMap.TryGetValue(row.ItemId, out var daily))
                    {
                        daily = dailyMap[row.ItemId] = new WowAuctionCommodityDaily
                        {
                            Date = minDate,
                            ItemId = row.ItemId,
                            Region = region,
                            DataPoints = Enumerable.Repeat(0, 9)
                                .Select(_ => new WowAuctionCommodityDaily.DailyDataPoint())
                                .ToList(),
                        };
                        Context.WowAuctionCommodityDaily.Add(daily);
                    }

                    daily.ListedMax = Math.Max(daily.ListedMax, row.Listed);
                    daily.ListedMin = daily.ListedMin == 0 ? row.Listed : Math.Min(daily.ListedMin, row.Listed);

                    // dataPoints.Add(row.Listed * row.);

                    for (int i = 0; i < row.Data.Count; i++)
                    {
                        var dataPoint = daily.DataPoints[i];
                        dataPoint.Max = Math.Max(dataPoint.Max, row.Data[i]);
                        dataPoint.Min = Math.Min(dataPoint.Min, row.Data[i]);
                        dataPoint.Listed += row.Listed;
                        dataPoint.TotalPrice += (row.Listed * row.Data[i]);
                    }
                }

                foreach ((int itemId, var daily) in dailyMap)
                {
                    foreach (var dataPoint in daily.DataPoints)
                    {
                        daily.AvgData.Add((int)(dataPoint.TotalPrice / dataPoint.Listed));
                        daily.MinData.Add(dataPoint.Min);
                        daily.MaxData.Add(dataPoint.Max);
                    }

                    // Logger.Debug("{date} {itemId} {min} {avg} {max}", minDate, itemId,
                    //     string.Join(",", daily.MinData),
                    //     string.Join(",", daily.AvgData),
                    //     string.Join(",", daily.MaxData)
                    // );
                }

                //
                string deleteQuery = string.Format(DeleteSql, region, timeZone, formattedDate);
                int deleted = await Context.Database.ExecuteSqlRawAsync(deleteQuery);
                // Logger.Information("Deleted {0} rows", deleted);
            }

            timer.AddPoint(((WowRegion)region).ToString());
        }

        await Context.SaveChangesAsync();

        timer.AddPoint("Save", true);
        Logger.Information("{timer}", timer.ToString());
    }
}
