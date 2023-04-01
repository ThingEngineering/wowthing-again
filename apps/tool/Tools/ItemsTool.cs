using Serilog.Context;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Models.Items;

namespace Wowthing.Tool.Tools;

public class ItemsTool
{
    private readonly JankTimer _timer = new();

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Items");
        await using var context = ToolContext.GetDbContext();

        ToolContext.Logger.Information("Loading data...");

        var items = await context.WowItem
            .AsNoTracking()
            .ToArrayAsync();

        var modifiedAppearances = await context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        var itemToModifiedAppearances = modifiedAppearances
            .ToGroupedDictionary(ima => ima.ItemId);

        var strings = await context.LanguageString
            .AsNoTracking()
            .Where(ls => ls.Type == StringType.WowItemName)
            .ToDictionaryAsync(
                ls => (ls.Language, ls.Id),
                ls => ls.String
            );

        _timer.AddPoint("Database");

        var db = ToolContext.Redis.GetDatabase();

        var cacheData = new RedisItems();
        string? cacheHash = null;

        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {Lang}...", language);

            cacheData.RawItems = items.Select(item => new RedisItemData(item)
                {
                    Appearances = itemToModifiedAppearances.GetValueOrDefault(item.Id, Array.Empty<WowItemModifiedAppearance>()),
                    Name = strings.GetValueOrDefault((language, item.Id), $"Item #{item.Id}"),
                })
                .ToArray();

            var cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            if (cacheHash == null)
            {
                cacheHash = cacheJson.Md5();
            }

            await db.SetCacheDataAndHash($"item-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Generate", true);
        ToolContext.Logger.Information("{0}", _timer.ToString());
    }
}
