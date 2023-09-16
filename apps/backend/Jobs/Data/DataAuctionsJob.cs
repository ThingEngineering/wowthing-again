using System.Net.Http;
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

    private Dictionary<int, WowItemBonus> _itemAppearanceBonuses;
    private ItemModifiedAppearanceCache _itemModifiedAppearances;

    private readonly Dictionary<string, WowAuctionTimeLeft> _timeLeftMap = new()
    {
        { "SHORT", WowAuctionTimeLeft.Short },
        { "MEDIUM", WowAuctionTimeLeft.Medium },
        { "LONG", WowAuctionTimeLeft.Long },
        { "VERY_LONG", WowAuctionTimeLeft.VeryLong },
    };

    private const string CreateTable = "CREATE TABLE {0} (LIKE wow_auction INCLUDING ALL)";

    private const string GetPartitions = @"
SELECT  pgc.relname
FROM    pg_catalog.pg_inherits pgi
INNER JOIN pg_catalog.pg_class pgc ON pgi.inhrelid = pgc.oid
WHERE   pgi.inhparent = 'wow_auction'::regclass
";

    private const string DetachPartition = "ALTER TABLE wow_auction DETACH PARTITION {0}";

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

    public override async Task Run(params string[] data)
    {
        var timer = new JankTimer();

        int connectedRealmId = int.Parse(data[0]);
        var realm = await Context.WowRealm
            .Where(realm => realm.ConnectedRealmId == connectedRealmId)
            .FirstOrDefaultAsync();

        using var shrug = AuctionLog(realm);

        var uri = GenerateUri(realm.Region, ApiNamespace.Dynamic, string.Format(ApiPath, connectedRealmId));
        JobHttpResult<ApiDataAuctions> result;
        try
        {
            result = await GetJson<ApiDataAuctions>(uri, timer: timer);
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

        string tableName = $"wow_auction_{connectedRealmId}_{DateTime.UtcNow:yyyyMMddHHmmss}";
        await using var connection = Context.GetConnection();
        await connection.OpenAsync();

        // Acquire the lock
        string lockKey = $"lock:auctions";
        string lockValue = Guid.NewGuid().ToString("N");
        bool locked = false;
        while (!locked)
        {
            locked = await JobRepository.AcquireLockAsync(lockKey, lockValue, TimeSpan.FromMinutes(1));
            if (!locked)
            {
                await Task.Delay(100);
            }
        }

        timer.AddPoint("Lock");

        await using var transaction = await connection.BeginTransactionAsync();
        await using var command = connection.CreateCommand();
        command.Transaction = transaction;

        // Create new table
        command.CommandText = string.Format(CreateTable, tableName);
        await command.ExecuteNonQueryAsync();

        timer.AddPoint("Create");

        // Copy auction data
        Dictionary<int, List<ApiDataAuctionsAuction>> auctionsByAppearanceId;
        Dictionary<string, List<ApiDataAuctionsAuction>> auctionsByAppearanceSource;
        await using (var writer = await connection.BeginBinaryImportAsync(string.Format(CopyAuctions, tableName)))
        {
            (auctionsByAppearanceId, auctionsByAppearanceSource) = await WriteAuctionData(writer, connectedRealmId, result.Data.Auctions);
        }

        timer.AddPoint("Copy");

        command.CommandText = GetPartitions;
        string existing = null;
        await using (var reader = await command.ExecuteReaderAsync())
        {
            while (reader.Read())
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
            command.CommandText = string.Format(DetachPartition, existing);
            await command.ExecuteNonQueryAsync();

            command.CommandText = string.Format(DropTable, existing);
            await command.ExecuteNonQueryAsync();
        }

        // Attach new partition
        command.CommandText = string.Format(AttachPartition, tableName, connectedRealmId);
        await command.ExecuteNonQueryAsync();

        timer.AddPoint("Partition");

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

        // Finalize the transaction
        await transaction.CommitAsync();

        timer.AddPoint("Commit", true);

        // Release the lock
        await JobRepository.ReleaseLockAsync(lockKey, lockValue);

        // Update the last checked time
        var db = Redis.GetDatabase();
        await db.HashSetAsync(
            RedisKeys.CheckedAuctions,
            connectedRealmId,
            DateTime.UtcNow.ToUnixTimeSeconds(),
            flags: CommandFlags.FireAndForget
        );

        Logger.Information("{Timer}", timer.ToString());
    }

    private async Task<(Dictionary<int, List<ApiDataAuctionsAuction>> appearanceIds, Dictionary<string, List<ApiDataAuctionsAuction>> appearanceSources)> WriteAuctionData(NpgsqlBinaryImporter writer, int realmId, List<ApiDataAuctionsAuction> dataAuctions)
    {
        var appearanceIds = new Dictionary<int, List<ApiDataAuctionsAuction>>();
        var appearanceSources = new Dictionary<string, List<ApiDataAuctionsAuction>>();

        foreach (var auction in dataAuctions)
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

            int? appearanceId = null;
            string appearanceSource = null;
            if (!Hardcoded.IgnoredAuctionItemIds.Contains(auction.Item.Id))
            {
                _itemModifiedAppearances.ByItemIdAndModifier.TryGetValue((auction.Item.Id, modifier),
                    out int actualAppearanceId);
                if (modifier > 0 && actualAppearanceId == 0)
                {
                    modifier = 0;
                    _itemModifiedAppearances.ByItemIdAndModifier.TryGetValue((auction.Item.Id, 0),
                        out actualAppearanceId);
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

            await writer.StartRowAsync();
            await writer.WriteAsync(realmId, NpgsqlDbType.Integer);
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

        return (appearanceIds, appearanceSources);
    }

    private async Task WriteCheapestByAppearanceIdData(
        NpgsqlBinaryImporter writer,
        int realmId,
        Dictionary<int, List<ApiDataAuctionsAuction>> auctionsByAppearanceId)
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
            await writer.WriteAsync(realmId, NpgsqlDbType.Integer);
            await writer.WriteAsync(appearanceId, NpgsqlDbType.Integer);
            await writer.WriteAsync(auction.Id, NpgsqlDbType.Integer);
        }

        await writer.CompleteAsync();
    }

    private async Task WriteCheapestByAppearanceSourceData(
        NpgsqlBinaryImporter writer,
        int realmId,
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
            await writer.WriteAsync(realmId, NpgsqlDbType.Integer);
            await writer.WriteAsync(appearanceSource, NpgsqlDbType.Varchar);
            await writer.WriteAsync(auction.Id, NpgsqlDbType.Integer);
        }

        await writer.CompleteAsync();
    }
}
