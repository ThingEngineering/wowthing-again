using Npgsql;
using NpgsqlTypes;
using Wowthing.Backend.Models;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataAuctionsJob : JobBase
    {
        private const string ApiPath = "data/wow/connected-realm/{0}/auctions";

        private readonly Dictionary<string, WowAuctionTimeLeft> TimeLeftMap = new()
        {
            { "SHORT", WowAuctionTimeLeft.Short },
            { "MEDIUM", WowAuctionTimeLeft.Medium },
            { "LONG", WowAuctionTimeLeft.Long },
            { "VERY_LONG", WowAuctionTimeLeft.VeryLong },
        };

        private const string SqlCreateTable = "CREATE TABLE {0} (LIKE wow_auction INCLUDING ALL)";

        private const string SqlGetPartitions = @"
SELECT  pgc.relname
FROM    pg_catalog.pg_inherits pgi
INNER JOIN pg_catalog.pg_class pgc ON pgi.inhrelid = pgc.oid
WHERE   pgi.inhparent = 'wow_auction'::regclass
";

        private const string SqlDetachPartition = "ALTER TABLE wow_auction DETACH PARTITION {0}";

        private const string SqlAttachPartition = "ALTER TABLE wow_auction ATTACH PARTITION {0} FOR VALUES IN ({1})";

        private const string SqlDropTable = "DROP TABLE {0}";

        private const string SqlCopy = @"
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
    bonus_ids,
    modifier_values,
    modifier_types
) FROM STDIN (FORMAT BINARY)
";

        public override async Task Run(params string[] data)
        {
            var timer = new JankTimer();

            var realmId = int.Parse(data[0]);
            var realm = await Context.WowRealm
                .Where(realm => realm.ConnectedRealmId == realmId)
                .FirstOrDefaultAsync();

            var shrug = AuctionLog(realm);

            var uri = GenerateUri(realm.Region, ApiNamespace.Dynamic, string.Format(ApiPath, realmId));
            JobHttpResult<ApiDataAuctions> result;
            try
            {
                result = await GetJson<ApiDataAuctions>(uri, timer: timer);
            }
            catch (TimeoutException)
            {
                Logger.Error("request timed out!");
                return;
            }

            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            var tableName = $"wow_auction_{realmId}_{DateTime.UtcNow:yyyyMMddHHmmss}";
            await using (var connection = Context.GetConnection())
            {
                await connection.OpenAsync();

                for (int retry = 0; retry < 5; retry++)
                {
                    await using var transaction = await connection.BeginTransactionAsync();
                    await using var command = connection.CreateCommand();
                    command.Transaction = transaction;

                    try
                    {
                        // Create new table
                        command.CommandText = string.Format(SqlCreateTable, tableName);
                        await command.ExecuteNonQueryAsync();

                        timer.AddPoint("Create");

                        // Copy auction data
                        await using (var writer = connection.BeginBinaryImport(string.Format(SqlCopy, tableName)))
                        {
                            foreach (var auction in result.Data.Auctions)
                            {
                                await writer.StartRowAsync();
                                await writer.WriteAsync(realmId, NpgsqlDbType.Integer);
                                await writer.WriteAsync(auction.Id, NpgsqlDbType.Integer);
                                await writer.WriteAsync(auction.Bid, NpgsqlDbType.Bigint);
                                await writer.WriteAsync(auction.UnitPrice > 0 ? auction.UnitPrice : auction.Buyout,
                                    NpgsqlDbType.Bigint);
                                await writer.WriteAsync(auction.Item.Id, NpgsqlDbType.Integer);
                                await writer.WriteAsync(auction.Quantity, NpgsqlDbType.Integer);
                                await writer.WriteAsync((short)TimeLeftMap[auction.TimeLeft], NpgsqlDbType.Smallint);
                                await writer.WriteAsync(auction.Item.Context, NpgsqlDbType.Smallint);
                                await writer.WriteAsync(auction.Item.PetBreedId, NpgsqlDbType.Smallint);
                                await writer.WriteAsync(auction.Item.PetLevel, NpgsqlDbType.Smallint);
                                await writer.WriteAsync(auction.Item.PetQualityId, NpgsqlDbType.Smallint);
                                await writer.WriteAsync(auction.Item.PetSpeciesId, NpgsqlDbType.Smallint);
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
                        }

                        timer.AddPoint("Copy");

                        command.CommandText = SqlGetPartitions;
                        string existing = null;
                        await using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (reader.Read())
                            {
                                var partition = reader.GetString(0);
                                if (partition.StartsWith($"wow_auction_{realmId}_"))
                                {
                                    existing = partition;
                                }
                            }
                        }

                        // Detach old partition if it exists
                        if (existing != null)
                        {
                            command.CommandText = string.Format(SqlDetachPartition, existing);
                            await command.ExecuteNonQueryAsync();
                        }

                        command.CommandText = string.Format(SqlAttachPartition, tableName, realmId);
                        await command.ExecuteNonQueryAsync();

                        // Drop old partition if it exists
                        if (existing != null)
                        {
                            command.CommandText = string.Format(SqlDropTable, existing);
                            await command.ExecuteNonQueryAsync();
                        }

                        await transaction.CommitAsync();
                    }
                    catch (PostgresException pe)
                    {
                        if (pe.SqlState == PostgresErrorCodes.DeadlockDetected)
                        {
                            Logger.Warning("Deadlock detected, retry #{Retry}", retry + 1);
                            await Task.Delay(retry * 500);
                            await transaction.RollbackAsync();
                        }
                        else
                        {
                            throw;
                        }
                    }
                    finally
                    {
                        retry = 5;
                        timer.AddPoint("Partition", true);
                    }
                }
            }

            Logger.Information("{Timer}", timer.ToString());
        }
    }
}
