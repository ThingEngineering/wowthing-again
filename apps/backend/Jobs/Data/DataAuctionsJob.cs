using System.Net.Http;
using System.Text.RegularExpressions;
using Npgsql;
using NpgsqlTypes;
using StackExchange.Redis;
using Wowthing.Backend.Data;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Backend.Models.Cache;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

// NOTE this is how Npgsql says to do it: https://www.npgsql.org/doc/api/NpgsqlTypes.NpgsqlDbType.html
// ReSharper disable BitwiseOperatorOnEnumWithoutFlags
namespace Wowthing.Backend.Jobs.Data;

public class DataAuctionsJob : JobBase
{
    private const string ApiPath = "data/wow/connected-realm/{0}/auctions";
    private const string CommoditiesPath = "data/wow/auctions/commodities";

    private Dictionary<int, WowItemBonus> _itemAppearanceBonuses;
    private ItemModifiedAppearanceCache _itemModifiedAppearances;

    private readonly Dictionary<string, WowAuctionTimeLeft> _timeLeftMap = new()
    {
        { "SHORT", WowAuctionTimeLeft.Short },
        { "MEDIUM", WowAuctionTimeLeft.Medium },
        { "LONG", WowAuctionTimeLeft.Long },
        { "VERY_LONG", WowAuctionTimeLeft.VeryLong },
    };

    private static readonly Regex PartitionPendingRegex = new("""partition "(.*?)\" already pending detach""");

    private static readonly int[] Buckets = { 10, 100, 1000, 10000 };

    private const string CreateTable = "CREATE TABLE {0} (LIKE wow_auction INCLUDING ALL)";

    private const string GetPartitions = @"
SELECT  pgc.relname
FROM    pg_catalog.pg_inherits pgi
INNER JOIN pg_catalog.pg_class pgc ON pgi.inhrelid = pgc.oid
WHERE   pgi.inhparent = 'wow_auction'::regclass
";

    private const string ConcurrentlyDetachPartition = "ALTER TABLE wow_auction DETACH PARTITION {0} CONCURRENTLY";
    private const string FinalizeDetachPartition = "ALTER TABLE wow_auction DETACH PARTITION {0} FINALIZE";

    private const string AttachPartition = "ALTER TABLE wow_auction ATTACH PARTITION {0} FOR VALUES IN ({1})";

    private const string DropTable = "DROP TABLE {0}";

    private const string CopyAuctions = @"
COPY {0} (
    connected_realm_id,
    auction_id,
    bid_price,
    buyout_price,
    item_id,
    quantity,
    time_left,
    context,
    pet_breed_id,
    pet_level,
    pet_quality,
    pet_species_id,
    appearance_id,
    appearance_source,
    bonus_ids,
    modifier_values,
    modifier_types
) FROM STDIN (FORMAT BINARY)
";

    private const string CopyCheapestByAppearanceId = @"
COPY wow_auction_cheapest_by_appearance_id (
    connected_realm_id,
    appearance_id,
    auction_id
) FROM STDIN (FORMAT BINARY)
";

    private const string CopyCheapestByAppearanceSource = @"
COPY wow_auction_cheapest_by_appearance_source (
    connected_realm_id,
    appearance_source,
    auction_id
) FROM STDIN (FORMAT BINARY)
";

    private const string CopyCommodityHourly = @"
COPY wow_auction_commodity_hourly (
    timestamp,
    item_id,
    listed,
    average10,
    average100,
    average1000,
    average10000,
    region
) FROM STDIN (FORMAT BINARY)
";

    public override async Task Run(params string[] data)
    {
        var timer = new JankTimer();

        var region = (WowRegion)int.Parse(data[0]);
        int connectedRealmId = int.Parse(data[1]);

        using var shrug = AuctionLog(region, connectedRealmId);

        var uri = GenerateUri(region, ApiNamespace.Dynamic, connectedRealmId > 100000
            ? CommoditiesPath
            : string.Format(ApiPath, connectedRealmId)
        );

        JobHttpResult<ApiDataAuctions> result;
        try
        {
            result = await GetJson<ApiDataAuctions>(uri, timer: timer, useLastModified: connectedRealmId < 100000);
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP request failed: {msg}", e.Message);
            return;
        }
        catch (Exception e) when (e is TimeoutException or TaskCanceledException)
        {
            Logger.Error("HTTP request timed out: {msg}", e.Message);
            return;
        }

        if (result.NotModified)
        {
            LogNotModified();
            return;
        }

        var itemBonuses = await MemoryCacheService.GetItemBonuses();
        _itemAppearanceBonuses = itemBonuses.ByType[WowItemBonusType.SetItemAppearanceModifier];
        _itemModifiedAppearances = await MemoryCacheService.GetItemModifiedAppearances();

        await using var connection = Context.GetConnection();
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();

        // Create new table
        string tableName = $"wow_auction_{connectedRealmId}_{DateTime.UtcNow:yyyyMMddHHmmss}";
        command.CommandText = string.Format(CreateTable, tableName);
        await command.ExecuteNonQueryAsync();

        timer.AddPoint("Create");

        // Copy auction data
        Dictionary<int, List<ApiDataAuctionsAuction>> auctionsByAppearanceId;
        Dictionary<string, List<ApiDataAuctionsAuction>> auctionsByAppearanceSource;
        Dictionary<int, List<ApiDataAuctionsAuction>> commodities;
        await using (var writer = await connection.BeginBinaryImportAsync(string.Format(CopyAuctions, tableName)))
        {
            (auctionsByAppearanceId, auctionsByAppearanceSource, commodities) = await WriteAuctionData(writer, connectedRealmId, result.Data.Auctions);
        }

        timer.AddPoint("Copy");

        // Acquire the lock
        string lockValue = Guid.NewGuid().ToString("N");
        bool locked = false;
        while (!locked)
        {
            locked = await JobRepository.AcquireLockAsync(RedisKeys.AuctionsLock, lockValue, TimeSpan.FromMinutes(1));
            if (!locked)
            {
                await Task.Delay(100);
            }
        }
        timer.AddPoint("Lock");

        // Get current partitions
        command.CommandText = GetPartitions;
        string existing = null;
        await using (var reader = await command.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                string partition = reader.GetString(0);
                if (partition.StartsWith($"wow_auction_{connectedRealmId}_"))
                {
                    existing = partition;
                }
            }
        }

        // Detach and drop old partition if it exists
        if (existing != null)
        {
            string detachSql = string.Format(ConcurrentlyDetachPartition, existing);
            command.CommandText = detachSql;

            try
            {
                await command.ExecuteNonQueryAsync();
            }
            catch (PostgresException ex)
            {
                // Partition already pending detach, fix that first
                if (ex.SqlState == PostgresErrorCodes.ObjectNotInPrerequisiteState)
                {
                    var m = PartitionPendingRegex.Match(ex.MessageText);
                    if (m.Success)
                    {
                        string pendingPartition = m.Groups[1].ToString();
                        Logger.Warning("Partition {p} pending detach, trying to finalize", pendingPartition);

                        command.CommandText = string.Format(FinalizeDetachPartition, pendingPartition);
                        await command.ExecuteNonQueryAsync();

                        command.CommandText = detachSql;
                        await command.ExecuteNonQueryAsync();
                    }
                }
                else
                {
                    throw;
                }
            }

            command.CommandText = string.Format(DropTable, existing);
            await command.ExecuteNonQueryAsync();
        }

        // Attach new partition
        command.CommandText = string.Format(AttachPartition, tableName, connectedRealmId);
        await command.ExecuteNonQueryAsync();

        timer.AddPoint("Partition");

        // Release the lock
        await JobRepository.ReleaseLockAsync(RedisKeys.AuctionsLock, lockValue);

        if (connectedRealmId < 100000)
        {
            // Update WowAuctionCheapestByAppearanceId
            await Context.WowAuctionCheapestByAppearanceId
                .Where(cheapest => cheapest.ConnectedRealmId == connectedRealmId)
                .ExecuteDeleteAsync();

            await using (var writer = await connection.BeginBinaryImportAsync(CopyCheapestByAppearanceId))
            {
                await WriteCheapestByAppearanceIdData(writer, connectedRealmId, auctionsByAppearanceId);
            }

            // Update WowAuctionCheapestByAppearanceSource
            await Context.WowAuctionCheapestByAppearanceSource
                .Where(cheapest => cheapest.ConnectedRealmId == connectedRealmId)
                .ExecuteDeleteAsync();

            await using (var writer = await connection.BeginBinaryImportAsync(CopyCheapestByAppearanceSource))
            {
                await WriteCheapestByAppearanceSourceData(writer, connectedRealmId, auctionsByAppearanceSource);
            }

            timer.AddPoint("Cheapest");
        }
        else
        {
            // Update WowAuctionCommodityHourly
            await using (var writer = await connection.BeginBinaryImportAsync(CopyCommodityHourly))
            {
                await WriteCommodityHourly(writer, region, connectedRealmId - 100000, commodities);
            }

            timer.AddPoint("Commodity");
        }

        // Update the last checked time
        var db = Redis.GetDatabase();
        await db.HashSetAsync(
            RedisKeys.CheckedAuctions,
            connectedRealmId,
            DateTime.UtcNow.ToUnixTimeSeconds(),
            flags: CommandFlags.FireAndForget
        );

        timer.AddPoint("Redis", true);

        Logger.Information("{Timer}", timer.ToString());
    }

    private async Task<
        (
            Dictionary<int, List<ApiDataAuctionsAuction>> appearanceIds,
            Dictionary<string, List<ApiDataAuctionsAuction>> appearanceSources,
            Dictionary<int, List<ApiDataAuctionsAuction>> commodities
        )
    > WriteAuctionData(NpgsqlBinaryImporter writer, int connectedRealmId, List<ApiDataAuctionsAuction> dataAuctions)
    {
        var appearanceIds = new Dictionary<int, List<ApiDataAuctionsAuction>>();
        var appearanceSources = new Dictionary<string, List<ApiDataAuctionsAuction>>();
        var commodities = new Dictionary<int, List<ApiDataAuctionsAuction>>();

        foreach (var auction in dataAuctions)
        {
            int? appearanceId = null;
            string appearanceSource = null;

            if (connectedRealmId < 100000)
            {
                short modifier = 0;
                int priority = 999;
                foreach (int bonusId in auction.Item.BonusLists.EmptyIfNull())
                {
                    if (!_itemAppearanceBonuses.TryGetValue(bonusId, out var itemBonus))
                    {
                        continue;
                    }

                    foreach (var bonus in itemBonus.Bonuses)
                    {
                        if (bonus[0] == (int)WowItemBonusType.SetItemAppearanceModifier)
                        {
                            int bonusPriority = bonus.Count >= 3 ? bonus[2] : 0;
                            if (bonusPriority < priority)
                            {
                                modifier = (short)bonus[1];
                                priority = bonusPriority;
                            }
                        }
                    }
                }

                if (!Hardcoded.IgnoredAuctionItemIds.Contains(auction.Item.Id))
                {
                    if (!_itemModifiedAppearances.ByItemIdAndModifier.TryGetValue((auction.Item.Id, modifier),
                            out int actualAppearanceId))
                    {
                        if (_itemModifiedAppearances.ModifiersByItemId.TryGetValue(auction.Item.Id,
                                out short[] possibleModifiers))
                        {
                            modifier = possibleModifiers[0];
                            actualAppearanceId =
                                _itemModifiedAppearances.ByItemIdAndModifier[(auction.Item.Id, modifier)];
                        }
                    }

                    if (actualAppearanceId > 0)
                    {
                        appearanceId = actualAppearanceId;
                        appearanceSource = $"{auction.Item.Id}_{modifier}";

                        if (!appearanceIds.TryGetValue(actualAppearanceId, out var idAuctions))
                        {
                            idAuctions = appearanceIds[actualAppearanceId] = new();
                        }

                        idAuctions.Add(auction);

                        if (!appearanceSources.TryGetValue(appearanceSource, out var sourceAuctions))
                        {
                            sourceAuctions = appearanceSources[appearanceSource] = new();
                        }

                        sourceAuctions.Add(auction);
                    }
                }
            }
            else
            {
                commodities.GetOrNew(auction.Item.Id).Add(auction);
            }

            await writer.StartRowAsync();
            await writer.WriteAsync(connectedRealmId, NpgsqlDbType.Integer);
            await writer.WriteAsync(auction.Id, NpgsqlDbType.Integer);
            await writer.WriteAsync(auction.Bid, NpgsqlDbType.Bigint);
            await writer.WriteAsync(auction.UnitPrice > 0 ? auction.UnitPrice : auction.Buyout,
                NpgsqlDbType.Bigint);
            await writer.WriteAsync(auction.Item.Id, NpgsqlDbType.Integer);
            await writer.WriteAsync(auction.Quantity, NpgsqlDbType.Integer);
            await writer.WriteAsync((short)_timeLeftMap[auction.TimeLeft], NpgsqlDbType.Smallint);
            await writer.WriteAsync(auction.Item.Context, NpgsqlDbType.Smallint);
            await writer.WriteAsync(auction.Item.PetBreedId, NpgsqlDbType.Smallint);
            await writer.WriteAsync(auction.Item.PetLevel, NpgsqlDbType.Smallint);
            await writer.WriteAsync(auction.Item.PetQualityId, NpgsqlDbType.Smallint);
            await writer.WriteAsync(auction.Item.PetSpeciesId, NpgsqlDbType.Smallint);

            if (appearanceId.HasValue)
            {
                await writer.WriteAsync(appearanceId.Value, NpgsqlDbType.Integer);
            }
            else
            {
                await writer.WriteNullAsync();
            }

            if (appearanceSource != null)
            {
                await writer.WriteAsync(appearanceSource, NpgsqlDbType.Varchar);
            }
            else
            {
                await writer.WriteNullAsync();
            }

            await writer.WriteAsync(auction.Item.BonusLists.EmptyIfNull(),
                NpgsqlDbType.Array | NpgsqlDbType.Integer);
            await writer.WriteAsync(
                auction.Item.Modifiers
                    .EmptyIfNull()
                    .Select(m => m.Value)
                    .ToArray(),
                NpgsqlDbType.Array | NpgsqlDbType.Integer
            );
            await writer.WriteAsync(
                auction.Item.Modifiers
                    .EmptyIfNull()
                    .Select(m => m.Type)
                    .ToArray(),
                NpgsqlDbType.Array | NpgsqlDbType.Smallint
            );
        }

        await writer.CompleteAsync();

        return (appearanceIds, appearanceSources, commodities);
    }

    private async Task WriteCheapestByAppearanceIdData(
        NpgsqlBinaryImporter writer,
        int connectedRealmId,
        Dictionary<int, List<ApiDataAuctionsAuction>> auctionsByAppearanceId
    )
    {
        foreach (var (appearanceId, auctions) in auctionsByAppearanceId)
        {
            var auction = auctions
                .Where(auction => auction.Buyout > 0)
                .MinBy(auction => auction.Buyout);
            if (auction == null)
            {
                continue;
            }

            await writer.StartRowAsync();
            await writer.WriteAsync(connectedRealmId, NpgsqlDbType.Integer);
            await writer.WriteAsync(appearanceId, NpgsqlDbType.Integer);
            await writer.WriteAsync(auction.Id, NpgsqlDbType.Integer);
        }

        await writer.CompleteAsync();
    }

    private async Task WriteCheapestByAppearanceSourceData(
        NpgsqlBinaryImporter writer,
        int connectedRealmId,
        Dictionary<string, List<ApiDataAuctionsAuction>> auctionsByAppearanceSource)
    {
        foreach (var (appearanceSource, auctions) in auctionsByAppearanceSource)
        {
            var auction = auctions
                .Where(auction => auction.Buyout > 0)
                .MinBy(auction => auction.Buyout);
            if (auction == null)
            {
                continue;
            }

            await writer.StartRowAsync();
            await writer.WriteAsync(connectedRealmId, NpgsqlDbType.Integer);
            await writer.WriteAsync(appearanceSource, NpgsqlDbType.Varchar);
            await writer.WriteAsync(auction.Id, NpgsqlDbType.Integer);
        }

        await writer.CompleteAsync();
    }

    private async Task WriteCommodityHourly(NpgsqlBinaryImporter writer,
        WowRegion wowRegion,
        int connectedRealmId,
        Dictionary<int, List<ApiDataAuctionsAuction>> commodities)
    {
        var now = DateTime.UtcNow;

        foreach (var (itemId, auctions) in commodities)
        {
            int[] counts = new int[4];
            long[] averages = new long[4];
            long[] totals = new long[4];
            long listed = 0;

            var sortedAuctions = auctions.OrderBy(auction => auction.UnitPrice);
            foreach (var auction in sortedAuctions)
            {
                listed += auction.Quantity;

                for (int i = 0; i < Buckets.Length; i++)
                {
                    int target = Buckets[i];
                    if (counts[i] < target)
                    {
                        int toAdd = Math.Min(auction.Quantity, target - counts[i]);
                        counts[i] += toAdd;
                        totals[i] += toAdd * (auction.UnitPrice / 100);
                    }
                }
            }

            for (int i = 0; i < Buckets.Length; i++)
            {
                if (counts[i] == Buckets[i])
                {
                    averages[i] = totals[i] / counts[i];
                }
            }

            await writer.StartRowAsync();
            await writer.WriteAsync(now, NpgsqlDbType.TimestampTz);
            await writer.WriteAsync(itemId, NpgsqlDbType.Integer);
            await writer.WriteAsync((int)Math.Min(int.MaxValue, listed), NpgsqlDbType.Integer);
            for (int i = 0; i < Buckets.Length; i++)
            {
                await writer.WriteAsync((int)Math.Min(int.MaxValue, averages[i]), NpgsqlDbType.Integer);
            }

            await writer.WriteAsync((short)wowRegion, NpgsqlDbType.Smallint);
        }

        await writer.CompleteAsync();
    }
}
